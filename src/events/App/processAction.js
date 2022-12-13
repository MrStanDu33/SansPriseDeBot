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
import EventBus from '$src/EventBus';

const {
  Action,
  ActionAddRole,
  ActionGoto,
  ActionPrintMessage,
  ActionPromptFile,
  ActionPromptFileHasAction,
  ActionQuestion,
  ActionQuestionAnswer,
  ActionQuestionAnswersHasAction,
  FollowedMember,
  Role,
  RolesToAddToMember,
} = models;

/** @typedef { import('$src/Models/Role').default } Role */

/**
 * @description Apply roles from roles waitlist to member.
 *
 * @param   { FollowedMember } member - Followed member to add roles to.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 *
 * await applyRoles(member);
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
 * @description Add given role to list of roles to add to the member.
 *
 * @param   { FollowedMember } member - Followed member to add role to.
 * @param   { Action }         role   - Role to add to member.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 *
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const role = await guild.roles.fetch('654691713893531669');
 *
 * await printMessage(member, role);
 */
const addRole = async (member, role) => {
  await RolesToAddToMember.create({
    FollowedMemberId: member.id,
    RoleId: role.AddRole.Role.id,
  });
};

/**
 * @description Remove given role to list of roles to add to the member.
 *
 * @param   { FollowedMember } member - Followed member to remove role to.
 * @param   { Action }         role   - Role to remove to member.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 *
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const role = await guild.roles.fetch('654691713893531669');
 *
 * await printMessage(member, role);
 */
const removeRole = async (member, role) => {
  await RolesToAddToMember.destroy({
    FollowedMemberId: member.id,
    RoleId: role.AddRole.Role.id,
  });
};

/**
 * @description Remove all roles to list of roles to add to the member.
 *
 * @param   { FollowedMember } member - Followed member to remove role to.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 *
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const role = await guild.roles.fetch('654691713893531669');
 *
 * await printMessage(member, role);
 */
const removeAllRoles = async (member) => {
  await RolesToAddToMember.destroy({
    FollowedMemberId: member.id,
  });
};

/**
 * @description Display message in the channel linked to the concerned member.
 *
 * @param   { FollowedMember } member - Followed member to print message to.
 * @param   { Action }         action - Message to print in the channel.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 * const message = new Message('Hello there 👋 have a nice {{ time }}', { time: 'day' });
 *
 * await printMessage(member, message);
 */
const printMessage = async (member, action) => {
  const { client } = Store;

  const channel = await client.channels.cache.get(
    member.LinkedChannel.discordId,
  );

  await channel.send({
    content: action.PrintMessage.message,
  });
};

/**
 * @description Display question and buttons linked to question's answers
 * in the channel linked to the concerned member.
 *
 * @param   { FollowedMember } member - Followed member to ask action to.
 * @param   { Action }         action - Question to ask to member.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 * const action = await Action.findOne({ where: { decisionsTreeId: 1 } });
 *
 * await askQuestion(member, action);
 */
const askQuestion = async (member, action) => {
  const { client } = Store;

  const channel = client.channels.cache.get(member.LinkedChannel.discordId);

  const messageRows = [];

  action.Question.Answers.forEach((answer, index) => {
    if (index % 5 === 0) {
      const buttonsRow = new ActionRowBuilder();
      messageRows.push(buttonsRow);
    }
    const buttonsRowIndexToPush = Math.ceil((index + 1) / 5) - 1;

    const serverEmoji = client.emojis.cache.find(
      (emoji) => emoji.name === answer.icon,
    );

    const button = new ButtonBuilder()
      .setCustomId(`FOLLOWED-MEMBER-ANSWER||${answer.id}||${uuidv4()}`)
      .setLabel(answer.text)
      .setStyle(ButtonStyle.Primary);

    const emoji = serverEmoji?.id || answer.icon;
    if (emoji) button.setEmoji(emoji);

    messageRows[buttonsRowIndexToPush].addComponents(button);
  });

  const { message } = new Message(action.Question.question, {
    memberId: member.memberId,
  });

  await channel.send({
    content: message,
    components: messageRows,
  });
};

/**
 * @description Ask user to send file in the channel linked to the concerned member.
 *
 * @param   { FollowedMember } member - Followed member to ask file to.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const member = await FollowedMember.findOne({ where { id: 12 }});
 * const action = await Action.findOne({ where: { decisionsTreeId: 1 } });
 *
 * await promptFile(member, action);
 */
const promptFile = async (member) => {
  // eslint-disable-next-line no-param-reassign
  member.needUploadFile = true;
  await member.save();
};

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
 * @description Get action to process for member and process it.
 *
 * @event module:Libraries/EventBus#App_processAction
 *
 * @param   { number }                  memberId - Followed member id to process action to.
 * @param   { number }                  actionId - Action id to process.
 *
 * @returns { Promise<boolean | void> }          - Returns false if action is not in list of
 *                                               allowed actions. Returns undefined if
 *                                               action was done.
 *
 * @fires module:Libraries/EventBus#App_getOutOfPipe
 *
 * @example
 * await EventBus.emit({ event: 'App_processAction', args: [ 12, 15 ] });
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
      { model: ActionAddRole, as: 'AddRole', include: Role },
      { model: ActionGoto, include: Action, as: 'Goto' },
      { model: ActionPrintMessage, as: 'PrintMessage' },
      {
        model: ActionPromptFile,
        as: 'PromptFile',
        include: {
          model: ActionPromptFileHasAction,
          as: 'Actions',
        },
      },
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
  });

  Logger.info(
    `processing action ${actionToPerform.type} for member ${member.username}`,
  );

  switch (actionToPerform.type) {
    case 'applyRoles': {
      await applyRoles(member);
      break;
    }
    case 'addRole': {
      await addRole(member, actionToPerform);
      break;
    }
    case 'removeRole': {
      await removeRole(member, actionToPerform);
      break;
    }
    case 'removeAllRoles': {
      await removeAllRoles(member);
      break;
    }
    case 'printMessage': {
      await printMessage(member, actionToPerform);
      await timeoutBeforeAction(2_000);
      break;
    }
    case 'question': {
      await askQuestion(member, actionToPerform);
      break;
    }
    case 'promptFile': {
      await promptFile(member);
      break;
    }
    case 'getOutOfPipe': {
      Logger.info(`Scheduled App_getOutOfPipe event in 60 seconds`);
      setTimeout(() => {
        EventBus.emit({ event: 'App_getOutOfPipe', args: [member] });
      }, 60000);
      break;
    }
    default: {
      const channel = client.channels.cache.get(member.LinkedChannel.discordId);
      await channel.send(
        `An error occured. <@&${process.env.DISCORD_STAFF_ROLE_ID}> has been informed about the issue and will contact you soon.`,
      );
      Logger.warn(
        `No action performed, as action is not one of handled ones. Prompted for ${actionToPerform.type}`,
      );
    }
  }

  return false;
};
