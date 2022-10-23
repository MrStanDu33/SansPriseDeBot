/**
 * @file Handle "user interacted with button" event from discord.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import EventBus from '$src/EventBus';
import models from '$src/Models';

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

/**
 * @description Function that is called when a member clicks on a button.
 * It check if button is linked to a possible answer based on question asked to member.
 * - If not, stop there and do nothing.
 * - If yes, it disable all buttons (and set to the selected one a color),
 * then temporarily replies with `...` and then delete the answer.
 * Finally, it tells bot to process answer's actions.
 *
 * @param   { Interaction }   interaction - Interaction.
 *
 * @returns { Promise<void> }
 */
export default async (interaction) => {
  if (!interaction.isButton()) return;

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
                include: Action,
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
      answer.text === interaction.customId.split('||')[0],
  );

  if (selectedAnswer === undefined) return;

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  selectedAnswer.Actions.forEach((action) => {
    EventBus.emit('App_processAction', followedMember.id, action.id);
  });
};
