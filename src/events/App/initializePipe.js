import i18n from '$src/I18n';
import { logs } from '$src/Db';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';

export default async (member) => {
  const { client } = Store;
  const { guild } = member;

  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Creating welcome channel for ${member.user.tag}`,
    'info',
  );

  const memberData = {
    guild: member.guild.id,
    locale: member.user.locale || process.env.DEFAULT_LOCALE,
    id: member.user.id,
    username: member.user.tag,
  };

  logs.push('/app/followingMembers[]', memberData, true);
  try {
    const channel = await guild.channels.create(
      `${i18n.l('WELCOME_CHANNEL_NAME')}-${member.user.username}`,
      {
        type: 'text',
        topic: i18n.l('WELCOME_CHANNEL_TOPIC'),
        nsfw: false,
        parent: client.channels.cache.get(
          process.env.DISCORD_WELCOME_CHANNEL_CATEGORY_ID,
        ),
        reason: i18n.l('WELCOME_CHANNEL_TOPIC'),
      },
    );
    loader.succeed();
    Logger.info(`Channel ${channel.name} successfully created !`);
    const data = {
      guild: channel.guild.id,
      id: channel.id,
      name: channel.name,
      createdTimestamp: channel.createdTimestamp,
      locale: member.user.locale || process.env.DEFAULT_LOCALE,
      linkedMemberId: member.user.id,
      linkedMemberUsername: member.user.tag,
    };

    logs.push('/app/followingChannels[]', data, true);

    EventBus.emit('sendWelcomeMessage', data);
  } catch (error) {
    loader.fail();
    Logger.error(
      ` An error has occurred while creating welcome channel for ${member.user.tag} !`,
      true,
    );
    throw new Error(error);
  }
};
