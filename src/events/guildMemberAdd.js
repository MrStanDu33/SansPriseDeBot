import i18n from '$src/I18n';
import db from '$src/db';
import EventBus from '$src/EventBus';

EventBus.on('newcomer', (member) => {
  const { guild } = member;
  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  guild.channels
    .create(`${i18n.l('WELCOME')}-${member.user.username}`)
    .then((channel) => {
      db.push(
        '/app/followingChannels[]',
        {
          guild: channel.guild.id,
          id: channel.id,
          name: channel.name,
          createdTimestamp: channel.createdTimestamp,
          locale: member.user.locale || process.env.DEFAULT_LOCALE,
        },
        true,
      );
    })
    .catch((error) => {
      throw new Error(error);
    });
});

export default (member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return;
  EventBus.emit('newcomer', member);
};
