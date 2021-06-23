import db from '$src/db';
import i18n from '$src/I18n';
import Store from '$src/Store';
import EventBus from '$src/EventBus';

export default (member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return;

  const { client } = Store;
  const { guild } = member;

  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  guild.channels
    .create(`${i18n.l('WELCOME_CHANNEL_NAME')}-${member.user.username}`, {
      type: 'text',
      topic: i18n.l('WELCOME_CHANNEL_TOPIC'),
      nsfw: false,
      parent: client.channels.cache.get(
        process.env.DISCORD_WELCOME_CHANNEL_CATEGORY_ID,
      ),
      reason: i18n.l('WELCOME_CHANNEL_TOPIC'),
    })
    .then((channel) => {
      const data = {
        guild: channel.guild.id,
        id: channel.id,
        name: channel.name,
        createdTimestamp: channel.createdTimestamp,
        locale: member.user.locale || process.env.DEFAULT_LOCALE,
        linkedMemberId: member.user.id,
        linkedMemberUsername: member.user.username,
      };

      db.push('/app/followingChannels[]', data, true);

      EventBus.emit('sendWelcomeMessage', data);
    })
    .catch((error) => {
      throw new Error(error);
    });
};
