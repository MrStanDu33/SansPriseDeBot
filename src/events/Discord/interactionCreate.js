/**
 * @file Handle "user interacted with button" event from discord.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import EventBus from '$src/EventBus';
import models from '$src/Models';
import Logger from '$src/Logger';

const { FollowedMember, Action, ActionQuestion, ActionQuestionAnswer } = models;

/** @typedef { import('discord.js').Interaction } Interaction */
/** @typedef { import('discord.js').Message } Message */

/**
 * @description It takes the original message and the Id of button pressed,
 * and then disables all the buttons in the message.
 * The button that has an Id matching given button Id gets a specific color.
 *
 * @param { Message } message         - The message that was sent by the bot.
 * @param { string }  clickedButtonId - The id of the button that was clicked.
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
  const followedMember = await FollowedMember.findOne({
    where: { memberId: interaction.user.id },
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
                  model: Action,
                  as: 'Actions',
                  through: 'Action_Question_Answers_has_Actions',
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (followedMember === null) return;

  const selectedAnswer = followedMember.Action.Question.Answers.find(
    (/** @type { object } */ answer) =>
      answer.text === interaction.customId.split('||')[1],
  );

  if (selectedAnswer === undefined) return;

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  // eslint-disable-next-line no-restricted-syntax
  for (const action of selectedAnswer.Actions) {
    // eslint-disable-next-line no-await-in-loop
    await EventBus.emit({
      event: 'App_processAction',
      args: [followedMember.id, action.id],
    });
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
 * @param   { Interaction } interaction - Interaction.
 *
 * @returns { void }
 *
 * @fires module:Libraries/EventBus#App_processAction
 *
 * @example
 * await EventBus.emit({ event: 'Discord_interactionCreate' });
 */
export default (interaction) => {
  if (!interaction.isButton()) return;

  // TODO: check if button for answer question by member or approve file by staff (prefix buttonId)

  const interactionDetails = interaction.customId.split('||');

  switch (interactionDetails[0]) {
    case '': {
      break;
    }
    case 'FOLLOWED-MEMBER-ANSWER-QUESTION': {
      processUserAnswer(interaction);
      break;
    }
    default: {
      Logger.warn('Button was pressed but unexpected can not be handled');
    }
  }
};
