import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import EventBus from '$src/EventBus';
import { logs, DecisionsTrees } from '$src/Db';

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

  const followedMember = logs.getFollowedMember(interaction.user.id);
  if (followedMember === null) return;

  const actualMemberProcess = DecisionsTrees.FormationRolesDecisionsTree.getRef(
    followedMember.currentProcess,
  );

  const selectedAnswer = actualMemberProcess.answers.find(
    (answer) => answer.text === interaction.customId.split('||')[0],
  );

  if (selectedAnswer === undefined) return;

  disableMessageButtons(interaction.message, interaction.customId);

  const reply = await interaction.reply({ content: '...', fetchReply: true });
  await reply.delete();

  Object.keys(selectedAnswer.actions).forEach((action) => {
    if (Object.hasOwnProperty.call(selectedAnswer.actions, action)) {
      const actionToPerform = selectedAnswer.actions[action];
      EventBus.emit('App_processAction', followedMember, actionToPerform);
    }
  });
};
