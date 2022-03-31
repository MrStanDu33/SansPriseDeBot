import { v4 as uuidv4 } from 'uuid';
import Store from '$src/Store';
import { logs, formationRolesDecisionsTree } from '$src/Db';
import { MessageActionRow, MessageButton } from 'discord.js';

const askQuestion = async (member, action) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.linkedChannel.id);

  const messageRows = [];

  action.answers.forEach((answer, index) => {
    if (index % 5 === 0) {
      const buttonsRow = new MessageActionRow();
      messageRows.push(buttonsRow);
    }
    const buttonsRowIndexToPush = Math.ceil((index + 1) / 5) - 1;
    messageRows[buttonsRowIndexToPush].addComponents(
      new MessageButton()
        .setCustomId(`${answer.text}||${uuidv4()}`)
        .setLabel(answer.text)
        .setStyle('PRIMARY')
        .setEmoji(
          channel.guild.emojis.cache.find(
            (emoji) => emoji.name === answer.icon,
          ),
        ),
    );
  });

  channel.send({
    content: action.question,
    components: messageRows,
  });
};

const addRole = (member, role) => {
  const roleToAdd = formationRolesDecisionsTree.getRef(role.role.$ref);

  logs.reload();

  const memberIndex = logs.getIndex('/app/followingMembers', member.id);
  if (memberIndex === -1) return;
  logs.push(`/app/followingMembers[${memberIndex}]/rolesToAdd[]`, roleToAdd);
};

const printMessage = (member, message) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.linkedChannel.id);

  channel.send({
    content: message.message,
  });
};

export default (member, action) => {
  const actionToPerform = action.$ref
    ? formationRolesDecisionsTree.getRef(action.$ref)
    : action;

  if (action.type === 'addRole') {
    return addRole(member, actionToPerform);
  }

  if (action.type === 'printMessage') {
    return printMessage(member, actionToPerform);
  }

  if (action.type === 'question') {
    logs.reload();

    const memberIndex = logs.getIndex('/app/followingMembers', member.id);
    if (memberIndex === -1) return null;
    logs.push(
      `/app/followingMembers[${memberIndex}]/currentProcess`,
      action.$ref ?? '/default',
    );
    return askQuestion(member, actionToPerform);
  }

  return false;
};
