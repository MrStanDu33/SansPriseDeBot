/**
 * @file Handle "new message" event from discord by checking wether user was prompted to.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import models from '$src/Models';
import Store from '$src/Store';
import Logger from '$src/Logger';
import { v4 as uuidv4 } from 'uuid';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const { Action, ActionPromptFile, MimeType, LinkedChannel, FollowedMember } =
  models;

/** @typedef { import('discord.js').Message } Message */

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
 * @param   { Message }       message       - Message that was created.
 * @param   { LinkedChannel } linkedChannel - Channel that contains the message.
 * @returns { Promise<void> }
 *
 * @example
 * await processPromptFileAnswer()
 */
const processPromptFileAnswer = async (message, linkedChannel) => {
  const expectedMimeTypes =
    linkedChannel.FollowedMember.Action.PromptFile.MimeTypes.map(
      ({ name }) => name,
    );

  const attachment = message.attachments.first();

  if (
    attachment === undefined ||
    !expectedMimeTypes.includes(attachment.contentType)
  ) {
    await message.channel.send(
      linkedChannel.FollowedMember.Action.PromptFile.errorMessage,
    );
    return;
  }

  await message.channel.send(`
    Merci de ton message, le <@&${process.env.DISCORD_STAFF_ROLE_ID}> reviendra vers toi rapidement pour t'assigner le rôle. Nous t'informerons lorsque cela sera fait
  `);

  // eslint-disable-next-line no-param-reassign
  linkedChannel.FollowedMember.needUploadFile = false;
  linkedChannel.FollowedMember.save();

  // eslint-disable-next-line no-await-in-loop
  await timeoutBeforeAction(1000);

  await message.channel.send('***⚠️ ⚠️ __Staff seulement__ ⚠️ ⚠️***');

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

  await message.channel.send({
    content: '\nSouhaitez-vous approuver le document ?',
    // @ts-ignore
    components: [component],
  });

  await message.channel.send('***⚠️ ⚠️ __Staff seulement__ ⚠️ ⚠️***');
};

/**
 * @description Function that is called when a member send a message in a channel.
 *
 * @event module:Libraries/EventBus#Discord_messageCreate
 *
 * @param { Message } message - Message that was created.
 *
 * @fires module:Libraries/EventBus#App_initializePipe
 *
 * @example
 * await EventBus.emit({ event: 'Discord_messageCreate' });
 */
export default async (message) => {
  Logger.info(
    '!spdb beta progress message ===',
    message.content === '!spdb beta process-me',
  );
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
