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

const ROLES_IDS_TO_KEEP = [
  '849789213167058985', // Actif | Niveau 1
  '849789381220892693', // Actif | Niveau 5
  '849789452162301982', // Actif | Niveau 10
  '849789508349722664', // Actif | Niveau 25
  '849789583221981185', // Actif | Niveau 50
  '892430779978752041', // Moderator
  '891323492711153725', // Sans prise de staff
  '714410506395451453', // Server Booster
  '1047783162694078534', // Béta Test
];

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

  const followedMember = await FollowedMember.findOne({
    where: { memberId: member.id },
  });

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
      id: process.env.DISCORD_STAFF_ROLE_ID,
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
        followedMember.isNewComer
          ? process.env.DISCORD_BOT_CHANNELS_CATEGORY_NEW_MEMBERS
          : process.env.DISCORD_BOT_CHANNELS_CATEGORY_AWAITING_MEMBERS,
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
 * @param   { Member }        member     - Member to process.
 * @param   { boolean }       isNewComer - Wether this event is called for a new member.
 *
 * @returns { Promise<void> }
 *
 * @fires module:Libraries/EventBus#App_processAction
 *
 * @example
 * await EventBus.emit({ event: 'App_processAction' });
 */
export default async (member, isNewComer = true) => {
  if (process.env.DRY_RUN === 'true') return;

  const channel = await createChannel(member);

  const memberRolesIdsToRemove = member.roles.cache
    .map(({ id }) => id)
    .filter(
      (roleId) =>
        !ROLES_IDS_TO_KEEP.includes(roleId) &&
        roleId !== member.guild.roles.everyone.id,
    );

  await member.roles.remove(memberRolesIdsToRemove);

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
    warnsForInactivity: 0,
    isNewComer,
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
