import Logger from '$src/Logger';
import Store from '$src/Store';
import { logs } from '$src/Db';
import EventBus from '$src/EventBus';

const syncMissingMembersInWaitList = async () => {
  const followedMembers = logs.getData('/app/followingMembers');
  const followedMembersIds = followedMembers.map((member) => member.id);

  const awaitingMembers = logs.getData('/app/awaitingMembers');
  const awaitingMembersIds = awaitingMembers.map((member) => member.id);

  const profilesNotToFetch = [...followedMembersIds, ...awaitingMembersIds];

  const guild = await Store.client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const members = await guild.members.fetch();

  const rawMembersToForceInclude = process.env.DISCORD_MEMBERS_TO_ONBOARD;
  const membersToForceInclude = rawMembersToForceInclude?.split(',') || [];

  members
    .filter((member) => {
      if (!membersToForceInclude.includes(member.user.id)) return false;
      if (member.user.bot) return false;
      if (member.user.system) return false;

      // eslint-disable-next-line no-underscore-dangle
      // if (member._roles.length !== 0) return false;
      if (profilesNotToFetch.includes(member.user.id)) return false;
      return true;
    })
    .each((member) => {
      const memberData = {
        // eslint-disable-next-line no-underscore-dangle
        roles: member._roles,
        locale: member.user.locale || process.env.DEFAULT_LOCALE,
        id: member.user.id,
        username: member.user.tag,
      };

      logs.push('/app/awaitingMembers[]', memberData, true);
      // EventBus.emit('App_initializePipe', member);
    });

  EventBus.emit('App_sortWaitList');
};

export default async () => {
  Logger.info('Start syncing Db');

  syncMissingMembersInWaitList();
  // TODO: syncLeftFollowedMembers

  Logger.info('End of Db syncing');
};
