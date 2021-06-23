import db from '$src/db';
import Store from '$src/Store';

export default (member) => {
  const { client } = Store;

  const followingChannels = db.getData('/app/followingChannels');
  const followingChannel = followingChannels.find(
    (ch) => ch.linkedMemberId === member.user.id,
  );

  const followingChannelIndex = db.getIndex(
    '/app/followingChannels',
    followingChannel.id,
  );

  const channel = client.channels.cache.get(followingChannel.id);

  channel.delete();
  db.delete(`/app/followingChannels[${followingChannelIndex}]`);
};
