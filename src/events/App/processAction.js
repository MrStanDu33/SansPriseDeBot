/**
 * @file Process needed action for followed member.
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

/** @typedef { import('$src/Models/Role').default } Role */

/**
 * @description Display question and buttons linked to question's answers
 * in the channel linked to the concerned member.
 *
 * @param { FollowedMember } member - Followed member to ask action to.
 * @param { Action }         action - Question to ask to member.
 */
const askQuestion = (member, action) => {
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

/**
 * @description Add given role to list of roles to add to the member.
 *
 * @param { FollowedMember } member - Followed member to add role to.
 * @param { Action }         role   - Role to add to member.
 */
const addRole = async (member, role) => {
  await RolesToAddToMember.create({
    FollowedMemberId: member.id,
    RoleId: role.Role.id,
  });
};

/**
 * @description Display message in the channel linked to the concerned member.
 *
 * @param { FollowedMember } member  - Followed member to add role to.
 * @param { Action }         message - Message to print in the channel.
 */
const printMessage = (member, message) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.LinkedChannel.discordId);

  channel.send({
    content: message.message,
  });
};

/**
 * @description Apply roles from roles waitlist to member.
 *
 * @param { FollowedMember } member - Followed member to add roles to.
 */
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

/**
 * @description Get action to process for member and process it.
 *
 * @param   { number }                  memberId - Followed member id to process action to.
 * @param   { number }                  actionId - Action id to process.
 *
 * @returns { Promise<boolean | void> }          - Returns false if action is not in list of
 *                                               allowed actions. Returns undefined if
 *                                               action was done.
 */
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
