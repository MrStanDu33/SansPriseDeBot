/**
 * @file Handle "new message" event from discord by checking wether user was prompted to.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import models from '$src/Models';
import Store from '$src/Store';
import Logger from '$src/Logger';
import Message from '$src/Classes/Message';
import { v4 as uuidv4 } from 'uuid';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const { Action, ActionPromptFile, MimeType, LinkedChannel, FollowedMember } =
  models;

/** @typedef { import('discord.js').Message } DiscordMessage */

/**
 * @description Returns a promise that resolves after a given amount of time.
 * Used to add time between two actions.
 *
 * @param   {number}    timeoutDuration - The amount of time to wait in miliseconds.
 *
 * @returns { Promise }                 Timeout promise.
 */
const timeoutBeforeAction = (timeoutDuration) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeoutDuration);
  });

/**
 * @description Function that check file sent by member.
 *
 * @param   { DiscordMessage } memberMessage - Message that was created.
 * @param   { LinkedChannel }  linkedChannel - Channel that contains the message.
 * @returns { Promise<void> }
 *
 * @example
 * await processPromptFileAnswer()
 */
const processPromptFileAnswer = async (memberMessage, linkedChannel) => {
  const expectedMimeTypes =
    linkedChannel.FollowedMember.Action.PromptFile.MimeTypes.map(
      ({ name }) => name,
    );

  const attachment = memberMessage.attachments.first();

  if (
    attachment === undefined ||
    !expectedMimeTypes.includes(attachment.contentType)
  ) {
    const { message } = new Message(
      linkedChannel.FollowedMember.Action.PromptFile.errorMessage,
      {
        memberId: linkedChannel.FollowedMember.memberId,
      },
    );

    await memberMessage.channel.send(message);
    return;
  }

  const { message } = new Message(
    linkedChannel.FollowedMember.Action.PromptFile.pendingMessage,
    {
      memberId: linkedChannel.FollowedMember.memberId,
    },
  );

  await memberMessage.channel.send(message);

  // eslint-disable-next-line no-param-reassign
  linkedChannel.FollowedMember.needUploadFile = false;
  linkedChannel.FollowedMember.save();

  // eslint-disable-next-line no-await-in-loop
  await timeoutBeforeAction(1000);

  await memberMessage.channel.send('***⚠️ ⚠️ __Staff seulement__ ⚠️ ⚠️***');

  const buttonApprove = new ButtonBuilder()
    .setCustomId(`STAFF-ACTION-APPROVE-FILE||approve||${uuidv4()}`)
    .setLabel('Approuver le document')
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅');

  const buttonReject = new ButtonBuilder()
    .setCustomId(`STAFF-ACTION-APPROVE-FILE||reject||${uuidv4()}`)
    .setLabel('Rejeter le document')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🗑️');

  const component = new ActionRowBuilder();
  component.addComponents(buttonApprove);
  component.addComponents(buttonReject);

  await memberMessage.channel.send({
    content: '\nSouhaitez-vous approuver le document ?',
    // @ts-ignore
    components: [component],
  });

  await memberMessage.channel.send('***⚠️ ⚠️ __Staff seulement__ ⚠️ ⚠️***');
};

/**
 * @description Function that is called when a member send a message in a channel.
 *
 * @event module:Libraries/EventBus#Discord_messageCreate
 *
 * @param { DiscordMessage } message - Message that was created.
 *
 * @fires module:Libraries/EventBus#App_initializePipe
 *
 * @example
 * await EventBus.emit({ event: 'Discord_messageCreate' });
 */
export default async (message) => {
  if (message.author.id === process.env.DISCORD_BOT_ID) return; // ignore bot messages
  const { client } = Store;

  const linkedChannel = await LinkedChannel.findOne({
    where: { discordId: message.channelId },
    include: [
      {
        model: FollowedMember,
        include: [
          {
            model: Action,
            include: [
              {
                model: ActionPromptFile,
                as: 'PromptFile',
                include: [{ model: MimeType, as: 'MimeTypes' }],
              },
            ],
          },
        ],
      },
    ],
  });

  if (linkedChannel === null) return; // message was not created in a channel tracked by the bot

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const member = await guild.members.fetch(message.author.id);
  const staffRole = await guild.roles.fetch(process.env.DISCORD_STAFF_ROLE_ID);
  const memberIsStaff = member.roles.cache.find((role) => role === staffRole);

  if (!memberIsStaff && linkedChannel.FollowedMember.memberId !== member.id)
    return; // message was not sent from user linked to the channel nor a staff member

  if (linkedChannel.FollowedMember.Action.PromptFile !== null) {
    if (memberIsStaff) return;
    if (linkedChannel.FollowedMember.needUploadFile !== true) return;
    processPromptFileAnswer(message, linkedChannel);
  } // user was not prompted to send a file.
};
