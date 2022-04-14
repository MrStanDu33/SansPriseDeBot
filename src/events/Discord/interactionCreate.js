import EventBus from '$src/EventBus';
import { logs, DecisionsTrees } from '$src/Db';

const disableMessageButtons = (message, clickedButtonId) => {
  const actionsRows = message.components.map((actionsRow) => ({
    ...actionsRow,
    components: actionsRow.components.map((button) => {
      // eslint-disable-next-line operator-linebreak
      const buttonStyle =
        button.customId === clickedButtonId ? 'SUCCESS' : 'SECONDARY';
      button.setStyle(buttonStyle);

      button.setDisabled(true);

      return button;
    }),
  }));

  message.edit({ components: actionsRows });
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
