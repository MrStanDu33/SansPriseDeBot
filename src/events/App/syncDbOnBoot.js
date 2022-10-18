/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember, FollowedMember } = models;

const getUserPriority = (roles) => {
  if (roles.includes('849789583221981185')) {
    return 50;
  }
  if (roles.includes('849789508349722664')) {
    return 25;
  }
  if (roles.includes('849789452162301982')) {
    return 10;
  }
  if (roles.includes('849789381220892693')) {
    return 5;
  }
  if (roles.includes('849789213167058985')) {
    return 1;
  }
  return 0;
};

const syncMissingMembersInWaitList = async () => {
  const guild = await Store.client.guilds
    .fetch(process.env.DISCORD_SERVER_ID)
    .catch(Logger.error);
  const guildMembers = await guild.members.fetch().catch(Logger.error);

  const rawMembersToForceInclude = process.env.DISCORD_MEMBERS_TO_ONBOARD;
  const membersToForceInclude = rawMembersToForceInclude?.split(',') || [];

  const members = guildMembers.filter((member) => {
    if (membersToForceInclude.includes(member.user.id)) return true;
    if (member.user.bot) return false;
    if (member.user.system) return false;

    // TODO: remove this return to enable public members to be processed
    return false;

    // eslint-disable-next-line no-underscore-dangle
    // if (member._roles.length !== 0) return false;
    // eslint-disable-next-line no-unreachable
    return true;
  });

  // eslint-disable-next-line no-restricted-syntax
  members.each(async (member) => {
    try {
      const isMemberFollowed = await FollowedMember.findOne({
        where: { memberId: member.user.id },
      });

      const isMemberAwaiting = await AwaitingMember.findOne({
        where: { memberId: member.user.id },
      });

      if (isMemberFollowed !== null || isMemberAwaiting !== null) return false;

      await AwaitingMember.create({
        // eslint-disable-next-line no-underscore-dangle
        existingRoles: JSON.stringify(member._roles),
        locale: member.user.locale || process.env.DEFAULT_LOCALE,
        memberId: member.user.id,
        username: member.user.tag,
        // eslint-disable-next-line no-underscore-dangle
        priority: getUserPriority(member._roles),
      });
    } catch (error) {
      Logger.error(error);
    }
    return true;
  });
};

export default async () => {
  Logger.info('Start syncing Db');

  await syncMissingMembersInWaitList();
  // TODO: syncLeftFollowedMembers

  Logger.info('End of Db syncing');
};
