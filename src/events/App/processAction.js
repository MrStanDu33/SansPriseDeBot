/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { v4 as uuidv4 } from 'uuid';
import Store from '$src/Store';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Message from '$src/Classes/Message';
import Logger from '$src/Logger';
import models from '$src/Models';

const {
  Action,
  ActionAddRole,
  ActionGoto,
  ActionPrintMessage,
  ActionQuestion,
  ActionQuestionAnswer,
  FollowedMember,
  Role,
  RolesToAddToMember,
} = models;

const askQuestion = async (member, action) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.LinkedChannel.discordId);

  const messageRows = [];

  action.Answers.forEach((answer, index) => {
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
    memberId: member.memberId,
  });

  channel.send({
    content: message,
    components: messageRows,
  });
};

const addRole = async (member, role) => {
  await RolesToAddToMember.create({
    FollowedMemberId: member.id,
    RoleId: role.Role.id,
  });
};

const printMessage = (member, message) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.LinkedChannel.discordId);

  channel.send({
    content: message.message,
  });
};

const applyRoles = async (member) => {
  const { client } = Store;

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const user = await guild.members.fetch(member.memberId);

  const rolesToAdd = await RolesToAddToMember.findAll({
    where: {
      FollowedMemberId: member.id,
    },
    include: Role,
  });

  await guild.roles.fetch(rolesToAdd[0].Role.discordId);

  const roles = rolesToAdd.map((roleToAdd) => {
    return {
      role: guild.roles.fetch(roleToAdd.Role.discordId),
      roleToAdd,
    };
  });

  try {
    await Promise.all(roles.map(({ role: promise }) => promise));

    /* eslint-disable no-restricted-syntax,no-await-in-loop */
    for (const { role, roleToAdd } of roles) {
      // eslint-disable-next-line
      const fetchedRole = await role;
      if (fetchedRole === null) {
        throw Error(
          `Unable to fetch role ${roleToAdd.Role.name}-${roleToAdd.Role.roleId}`,
        );
      }
      user.roles.add(fetchedRole);
    }
    /* eslint-enable no-restricted-syntax,no-await-in-loop */
  } catch (error) {
    Logger.error(true, 'An error occurred while fetching a role', error);
  }
};

export default async (memberId, actionId) => {
  const { client } = Store;

  const member = await FollowedMember.findOne({
    where: { id: memberId },
    include: { all: true },
  });

  member.CurrentActionId = actionId;
  await member.save();

  const actionToPerform = await Action.findOne({
    where: { id: actionId },
    include: [
      {
        model: ActionAddRole,
        as: 'AddRole',
        include: Role,
      },
      {
        model: ActionGoto,
        include: Action,
        as: 'Goto',
      },
      {
        model: ActionPrintMessage,
        as: 'PrintMessage',
      },
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
  });

  switch (actionToPerform.type) {
    case 'applyRoles': {
      return applyRoles(member);
    }
    case 'addRole': {
      return addRole(member, actionToPerform.AddRole);
    }
    case 'printMessage': {
      return printMessage(member, actionToPerform.PrintMessage);
    }
    case 'question': {
      return askQuestion(member, actionToPerform.Question);
    }
    default: {
      const channel = client.channels.cache.get(member.LinkedChannel.discordId);
      channel.send(`No action performed, prompted for ${actionToPerform.type}`);
    }
  }

  return false;
};
