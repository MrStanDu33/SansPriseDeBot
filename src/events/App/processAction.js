import { v4 as uuidv4 } from 'uuid';
import Store from '$src/Store';
import { logs, DecisionsTrees } from '$src/Db';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Message from '$src/Classes/Message';
import Logger from '$src/Logger';

const askQuestion = async (member, action) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.linkedChannel.id);

  const messageRows = [];

  action.answers.forEach((answer, index) => {
    if (index % 5 === 0) {
      const buttonsRow = new ActionRowBuilder();
      messageRows.push(buttonsRow);
    }
    const buttonsRowIndexToPush = Math.ceil((index + 1) / 5) - 1;

    const serverEmoji = client.emojis.cache.find(
      (emoji) => emoji.name === answer.icon,
    );

    const button = new ButtonBuilder()
      .setCustomId(`${answer.text}||${uuidv4()}`)
      .setLabel(answer.text)
      .setStyle(ButtonStyle.Primary);

    const emoji = serverEmoji?.id || answer.icon;
    if (emoji) button.setEmoji(emoji);

    messageRows[buttonsRowIndexToPush].addComponents(button);
  });

  const { message } = new Message(action.question, {
    memberId: member.id,
  });

  channel.send({
    content: message,
    components: messageRows,
  });
};

const addRole = (member, role) => {
  const roleToAdd = DecisionsTrees.FormationRolesDecisionsTree.getRef(
    role.role.$ref,
  );

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

const applyRoles = async (member) => {
  const { client } = Store;

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const user = await guild.members.fetch(member.id);

  const rolesToAdd = member.rolesToAdd || [];

  const roles = rolesToAdd.map((roleToAdd) => ({
    role: guild.roles.fetch(roleToAdd.roleId),
    roleToAdd,
  }));

  try {
    await Promise.all(roles.map(({ role: promise }) => promise));

    /* eslint-disable no-restricted-syntax,no-await-in-loop */
    for (const { role, roleToAdd } of roles) {
      // eslint-disable-next-line
      const fetchedRole = await role;
      if (fetchedRole === null) {
        throw Error(
          `Unable to fetch role ${roleToAdd.name}-${roleToAdd.roleId}`,
        );
      }
      user.roles.add(fetchedRole);
    }
    /* eslint-enable no-restricted-syntax,no-await-in-loop */
  } catch (error) {
    Logger.error(true, 'An error occurred while fetching a role', error);
  }
};

export default (member, action) => {
  const { client } = Store;

  const actionToPerform = action.$ref
    ? DecisionsTrees.FormationRolesDecisionsTree.getRef(action.$ref)
    : action;

  switch (action.type) {
    case 'applyRoles': {
      return applyRoles(member, actionToPerform);
    }
    case 'addRole': {
      return addRole(member, actionToPerform);
    }
    case 'printMessage': {
      return printMessage(member, actionToPerform);
    }
    case 'question': {
      logs.reload();

      const memberIndex = logs.getIndex('/app/followingMembers', member.id);
      if (memberIndex === -1) return null;
      logs.push(
        `/app/followingMembers[${memberIndex}]/currentProcess`,
        action.$ref ?? '/default',
      );
      return askQuestion(member, actionToPerform);
    }
    default: {
      const channel = client.channels.cache.get(member.linkedChannel.id);
      channel.send(`No action performed, prompted for ${action.type}`);
    }
  }

  return false;
};
