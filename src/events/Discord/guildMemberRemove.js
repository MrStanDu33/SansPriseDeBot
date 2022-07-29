import { logs } from '$src/Db';
import Logger from '$src/Logger/index';
import Store from '$src/Store';

export default (member) => {
  if (process.env.DRY_RUN === 'true') return;
  /*
   * TODO: Detect on boot diff between channels on db and users on server.
   * if so => delete channel and record !
   */
  const { client } = Store;

  Logger.info(`A member just left ! (${member.user.tag})`);
  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Deleting welcome channel for ${member.user.tag}`,
    'info',
  );

  const followingMembers = logs.getData('/app/followingMembers');
  const followingMember = followingMembers.find(
    (ch) => ch.id === member.user.id,
  );

  const followingMemberIndex = logs.getIndex(
    '/app/followingMembers',
    followingMember.id,
  );

  const channel = client.channels.cache.get(followingMember.linkedChannel.id);

  channel
    .delete()
    .then(() => {
      loader.succeed();
      Logger.info(
        `Channel ${followingMember.linkedChannel.name} successfully deleted !`,
      );
      logs.delete(`/app/followingMembers[${followingMemberIndex}]`);
    })
    .catch((error) => {
      loader.fail();
      Logger.error(
        ` An error has occurred while deleting welcome channel for ${member.user.tag}!`,
        true,
      );
      throw new Error(error);
    });
};
