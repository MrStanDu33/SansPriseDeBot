/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { PermissionsBitField, ChannelType } from 'discord.js';
import i18n from '$src/I18n';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import models from '$src/Models';

const { LinkedChannel, FollowedMember, DecisionsTree, Action } = models;

const createChannel = async (member) => {
  const { client } = Store;
  const { guild } = member;
  i18n.setLocale(member.user.locale || process.env.DEFAULT_LOCALE);

  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Creating welcome channel for ${member.user.tag}`,
    'info',
  );
  const permissions = new PermissionsBitField();
  permissions.add(PermissionsBitField.Flags.ViewChannel);

  const channelPermissionOverwrites = [
    {
      id: guild.roles.everyone.id,
      type: 'role',
      deny: permissions,
    },
    {
      id: member.id,
      allow: permissions,
    },
    {
      id: client.user.id,
      allow: permissions,
    },
    {
      id: process.env.DISCORD_DEBUG_ACCOUNT_ID,
      allow: permissions,
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
        process.env.DISCORD_WELCOME_CHANNEL_CATEGORY_ID,
      ),
      reason: i18n.l('WELCOME_CHANNEL_TOPIC'),
      permissionOverwrites: channelPermissionOverwrites,
    })
    .catch((error) => {
      loader.fail();
      Logger.error(new Error(error));
    });

  loader.succeed();
  Logger.info(`Channel ${channel.name} successfully created !`);

  return channel;
};

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
  });

  await LinkedChannel.create({
    discordId: channel.id,
    name: channel.name,
    FollowedMemberId: memberData.id,
  });

  EventBus.emit('App_processAction', memberData.id, defaultAction.id);
};
