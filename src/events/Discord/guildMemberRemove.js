import db from '$src/db';
import Logger from '$src/Logger/index';
import Store from '$src/Store';

export default (member) => {
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

  const followingChannels = db.getData('/app/followingChannels');
  const followingChannel = followingChannels.find(
    (ch) => ch.linkedMemberId === member.user.id,
  );

  const followingChannelIndex = db.getIndex(
    '/app/followingChannels',
    followingChannel.id,
  );

  const channel = client.channels.cache.get(followingChannel.id);

  channel
    .delete()
    .then(() => {
      loader.succeed();
      Logger.info(`Channel ${followingChannel.name} successfully deleted !`);
      db.delete(`/app/followingChannels[${followingChannelIndex}]`);
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
