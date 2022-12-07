/**
 * @file Initialize pipe for followed member.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { PermissionsBitField, ChannelType } from 'discord.js';
import i18n from '$src/I18n';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import models from '$src/Models';

/** @typedef { import('discord.js').GuildMember } Member */
/** @typedef { import('discord.js').GuildChannel } Channel */

const { LinkedChannel, FollowedMember, DecisionsTree, Action } = models;

/**
 * @description It creates a channel in the welcome category, with the name of the user, and
 * with the topic of the channel being the welcome message.
 *
 * @param   { Member }           member - The member that joined the server.
 *
 * @returns { Promise<Channel> }        - The channel object instance.
 *
 * @example
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const member = await guild.members.fetch('691583992587354112');
 *
 * await createChannel(member);
 */
const createChannel = async (member) => {
  const { client } = Store;
  const { guild } = member;
  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Creating welcome channel for ${member.user.tag}`,
    'info',
  );

  const channelPermissionOverwrites = [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: member.id,
      allow: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: client.user.id,
      allow: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: process.env.DISCORD_DEBUG_ACCOUNT_ID,
      allow: [PermissionsBitField.Flags.ViewChannel],
    },
  ];

  const channel = await guild.channels
    .create({
      name: `${i18n.l('WELCOME_CHANNEL_NAME')}-${member.user.username}#${
        member.user.discriminator
      }`,
      type: ChannelType.GuildText,
      topic: i18n.l('WELCOME_CHANNEL_TOPIC'),
      nsfw: false,
      parent: client.channels.cache.get(
        process.env.DISCORD_BOT_CHANNELS_CATEGORY,
      ),
      reason: i18n.l('WELCOME_CHANNEL_TOPIC'),
      permissionOverwrites: channelPermissionOverwrites,
    })
    .catch((error) => {
      loader.fail();
      Logger.error(new Error(error));
    });

  if (!channel) throw new Error('Unable to create welcome channel');

  loader.succeed();
  Logger.info(`Channel ${channel.name} successfully created !`);

  return channel;
};

/**
 * @description Initialize pipe by creating a channel for the member and process action.
 *
 * @event module:Libraries/EventBus#App_initializePipe
 *
 * @param   { Member }        member - Member to process.
 *
 * @returns { Promise<void> }
 *
 * @fires module:Libraries/EventBus#App_processAction
 *
 * @example
 * await EventBus.emit({ event: 'App_processAction' });
 */
export default async (member) => {
  if (process.env.DRY_RUN === 'true') return;

  const channel = await createChannel(member);

  const decisionsTree = await DecisionsTree.findOne({
    where: { name: 'FormationRoles' },
  });

  const defaultAction = await Action.findOne({
    where: { decisionsTreeId: decisionsTree.id },
  });

  const memberData = await FollowedMember.create({
    guildId: member.guild.id,
    locale: member.user.locale || process.env.DEFAULT_LOCALE,
    memberId: member.user.id,
    username: member.user.tag,
    CurrentActionId: null,
    rolesToAdd: [],
    inProcess: true,
  });

  await LinkedChannel.create({
    discordId: channel.id,
    name: channel.name,
    FollowedMemberId: memberData.id,
  });

  await EventBus.emit({
    event: 'App_processAction',
    args: [memberData.id, defaultAction.id],
  });
};
