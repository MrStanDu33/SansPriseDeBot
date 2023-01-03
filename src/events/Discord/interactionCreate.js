/**
 * @file Handle "user interacted with button" event from discord.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import Store from '$src/Store';
import EventBus from '$src/EventBus';
import models from '$src/Models';
import Logger from '$src/Logger';
import Message from '$src/Classes/Message';

const {
  FollowedMember,
  Action,
  ActionQuestion,
  ActionQuestionAnswer,
  ActionQuestionAnswersHasAction,
  LinkedChannel,
  ActionPromptFile,
  ActionPromptFileHasAction,
} = models;

/** @typedef { import('discord.js').Interaction } Interaction */
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
 * @description It takes the original message and the Id of button pressed,
 * and then disables all the buttons in the message.
 * The button that has an Id matching given button Id gets a specific color.
 *
 * @param { DiscordMessage } message         - The message that was sent by the bot.
 * @param { string }         clickedButtonId - The id of the button that was clicked.
 *
 * @example
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const channel = await guild.channels.fetch('646359583895322645');
 * const message = await channel.messages.fetch('1042073991935955054'); // message with buttons
 *
 * const clickedButtonId = 'Yes||f59fc0a4-e351-4eaf-acfd-f3ed72dd7233' // id of clicked button.
 *
 * await disableMessageButtons(messages, clickedButtonId);
 */
const disableMessageButtons = async (message, clickedButtonId) => {
  const newActionRowEmbeds = message.components.map((oldActionRow) => {
    const updatedActionRow = new ActionRowBuilder();

    updatedActionRow.addComponents(
      oldActionRow.components.map((buttonComponent) => {
        // @ts-ignore
        const newButton = ButtonBuilder.from(buttonComponent);

        // eslint-disable-next-line operator-linebreak
        const buttonStyle =
          buttonComponent.customId === clickedButtonId
            ? ButtonStyle.Primary
            : ButtonStyle.Secondary;
        newButton.setStyle(buttonStyle);
        newButton.setDisabled(true);
        return newButton;
      }),
    );
    return updatedActionRow;
  });

  // @ts-ignore
  message.edit({ components: newActionRowEmbeds });
};

const processUserAnswer = async (interaction) => {
  const linkedChannel = await LinkedChannel.findOne({
    where: { discordId: interaction.channelId },
    include: [
      {
        model: FollowedMember,
        include: [
          {
            model: Action,
            include: [
              {
                model: ActionQuestion,
                as: 'Question',
                include: [
                  {
                    model: ActionQuestionAnswer,
                    as: 'Answers',
                    include: {
                      model: ActionQuestionAnswersHasAction,
                      as: 'AnswerActions',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (linkedChannel.FollowedMember === null) return;

  const selectedAnswer =
    linkedChannel.FollowedMember.Action.Question.Answers.find(
      (/** @type { object } */ answer) =>
        answer.id === Number(interaction.customId.split('||')[1]),
    );

  if (selectedAnswer === undefined) return;

  Logger.info(
    `Member ${linkedChannel.FollowedMember.username} answered ${selectedAnswer.text} to the question ${linkedChannel.FollowedMember.Action}`,
  );

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  // eslint-disable-next-line no-restricted-syntax
  for (const action of selectedAnswer.AnswerActions) {
    // eslint-disable-next-line no-await-in-loop
    await EventBus.emit({
      event: 'App_processAction',
      args: [linkedChannel.FollowedMember.id, action.ActionId],
    });

    // eslint-disable-next-line no-await-in-loop
    await timeoutBeforeAction(1000);
  }
};

const processStaffFileValidation = async (interaction, guild) => {
  const linkedChannel = await LinkedChannel.findOne({
    where: { discordId: interaction.channelId },
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
                include: [{ model: ActionPromptFileHasAction, as: 'Actions' }],
              },
            ],
          },
        ],
      },
    ],
  });

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  const staffDecision = interaction.customId.split('||')[1];
  const channel = await guild.channels.fetch(linkedChannel.discordId);

  switch (staffDecision) {
    case 'approve': {
      linkedChannel.FollowedMember.needUploadFile = null;
      linkedChannel.FollowedMember.save();

      const { message } = new Message(
        linkedChannel.FollowedMember.Action.PromptFile.approvedMessage,
        {
          memberId: linkedChannel.FollowedMember.memberId,
        },
      );

      await channel.send(message);

      // eslint-disable-next-line no-restricted-syntax
      for (const action of linkedChannel.FollowedMember.Action.PromptFile
        .Actions) {
        // eslint-disable-next-line no-await-in-loop
        await EventBus.emit({
          event: 'App_processAction',
          args: [linkedChannel.FollowedMember.id, action.ActionId],
        });

        // eslint-disable-next-line no-await-in-loop
        await timeoutBeforeAction(1000);
      }
      break;
    }
    case 'reject': {
      linkedChannel.FollowedMember.needUploadFile = true;
      linkedChannel.FollowedMember.save();

      const { message } = new Message(
        linkedChannel.FollowedMember.Action.PromptFile.rejectedMessage,
        {
          memberId: linkedChannel.FollowedMember.memberId,
        },
      );

      await channel.send(message);
      break;
    }
    default: {
      Logger.warn(
        `Unable to determine action to do with request ${staffDecision}`,
      );
    }
  }
};

/**
 * @description Function that is called when a member clicks on a button.
 * It check if button is linked to a possible answer based on question asked to member.
 * - If not, stop there and do nothing.
 * - If yes, it disable all buttons (and set to the selected one a color),
 * then temporarily replies with `...` and then delete the answer.
 * Finally, it tells bot to process answer's actions.
 *
 * @event module:Libraries/EventBus#Discord_interactionCreate
 *
 * @param   { Interaction }   interaction - Interaction.
 *
 * @returns { Promise<void> }
 *
 * @fires module:Libraries/EventBus#App_processAction
 *
 * @example
 * await EventBus.emit({ event: 'Discord_interactionCreate' });
 */
export default async (interaction) => {
  const { client } = Store;
  if (!interaction.isButton() && !interaction.isCommand()) return;

  // TODO: check if button for answer question by member or approve file by staff (prefix buttonId)

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const member = await guild.members.fetch(interaction.user.id);
  const staffRole = await guild.roles.fetch(process.env.DISCORD_STAFF_ROLE_ID);
  const memberIsStaff = member.roles.cache.find((role) => role === staffRole);

  if (interaction.isButton()) {
    const interactionDetails = interaction.customId.split('||');

    switch (interactionDetails[0]) {
      case 'STAFF-ACTION-APPROVE-FILE': {
        if (!memberIsStaff) {
          interaction.reply({
            content:
              'Cette action est reservée aux membres du staff.\nCes derniers valideront le processus sous peu, veuillez patienter.',
            ephemeral: true,
          });
          return;
        }
        processStaffFileValidation(interaction, guild);
        break;
      }
      case 'FOLLOWED-MEMBER-ANSWER': {
        processUserAnswer(interaction);
        break;
      }
      default: {
        Logger.warn('Button was pressed but unexpected can not be handled');
      }
    }
    return;
  }
  if (interaction.isCommand()) {
    if (!memberIsStaff) return;
    // TODO: Ony answer to /ping commands
    interaction.reply({
      content: 'PONG 🕹️',
    });
  }
};
