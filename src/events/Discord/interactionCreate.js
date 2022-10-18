/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import EventBus from '$src/EventBus';
import models from '$src/Models';

const { FollowedMember, Action, ActionQuestion, ActionQuestionAnswer } = models;

const disableMessageButtons = async (message, clickedButtonId) => {
  const newActionRowEmbeds = message.components.map((oldActionRow) => {
    const updatedActionRow = new ActionRowBuilder();

    updatedActionRow.addComponents(
      oldActionRow.components.map((buttonComponent) => {
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

  message.edit({ components: newActionRowEmbeds });
};

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
    (answer) => answer.text === interaction.customId.split('||')[0],
  );

  if (selectedAnswer === undefined) return;

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  selectedAnswer.Actions.forEach((action) => {
    EventBus.emit('App_processAction', followedMember.id, action.id);
  });
};
