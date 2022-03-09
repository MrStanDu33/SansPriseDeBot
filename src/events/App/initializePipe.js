import { Permissions } from 'discord.js';
import i18n from '$src/I18n';
import { logs } from '$src/Db';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';

export default async (member) => {
  if (process.env.DRY_RUN === 'true') return;
  const { client } = Store;
  const { guild } = member;

  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Creating welcome channel for ${member.user.tag}`,
    'info',
  );

  try {
    const channel = await guild.channels.create(
      `${i18n.l('WELCOME_CHANNEL_NAME')}-${member.user.username}#${
        member.user.discriminator
      }`,
      {
        type: 'text',
        topic: i18n.l('WELCOME_CHANNEL_TOPIC'),
        nsfw: false,
        parent: client.channels.cache.get(
          process.env.DISCORD_WELCOME_CHANNEL_CATEGORY_ID,
        ),
        reason: i18n.l('WELCOME_CHANNEL_TOPIC'),
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            type: 'role',
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: member.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: client.user.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          },
        ],
      },
    );

    loader.succeed();
    Logger.info(`Channel ${channel.name} successfully created !`);

    const memberData = {
      guild: member.guild.id,
      locale: member.user.locale || process.env.DEFAULT_LOCALE,
      id: member.user.id,
      username: member.user.tag,
      followingAt: new Date().getTime(),
      lastUpdateAt: new Date().getTime(),
      linkedChannel: {
        id: channel.id,
        name: channel.name,
      },
      currentProcess: '?',
    };

    logs.push('/app/followingMembers[]', memberData, true);

    EventBus.emit('App_sendWelcomeMessage', memberData);
  } catch (error) {
    loader.fail();
    Logger.error(
      ` An error has occurred while creating welcome channel for ${member.user.tag} !`,
      true,
    );
    throw new Error(error);
  }
};
