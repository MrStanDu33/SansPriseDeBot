/**
 * @file Get member out of pipe after an inactivity period.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import Store from '$src/Store';
import models from '$src/Models';
import Message from '$src/Classes/Message';
import { Op } from '@sequelize/core';

const { FollowedMember, LinkedChannel } = models;

const TIMEOUT_IN_DAYS = 5;
// TODO: Insert channel's link.
const ONE_DAY_INACTIVITY_MESSAGE = `Bonjour, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement pas encore répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.
Tu peux retrouver notre conversation ici: <#{{ channelId }}>

Au plaisir de te revoir 👋`;
// TODO: Insert channel's link.
const HALF_TIME_BEFORE_TIMEOUT_INACTIVITY_MESSAGE = `Bonjour, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement toujours pas répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.
Si tu n'y réponds pas dans les prochains jours, tu risque d'être ejecté du serveur.

Tu peux retrouver notre conversation pour la continuer ici: <#{{ channelId }}>

Au plaisir de te revoir 👋`;
// TODO: Insert channel's link.
const LAST_DAY_BEFORE_TIMEOUT_INACTIVITY_MESSAGE = `Bonjour, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement toujours pas répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.
Si nous n'avons pas de réponse de ta part à mes questions, nous seront dans l'obligation de t'éjecter du serveur.

Tu peux retrouver notre conversation pour la continuer ici: <#{{ channelId }}>

Au plaisir de te revoir 👋`;
const TIMEOUT_MESSAGE = `Bonjour, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Malheureusement, tu n'as pas pris le temps de répondre à mes questions.
Pour des raisons de limitation technique de la plateforme Discord, j'étais dans l'obligation de te retirer du serveur.

Si tu souhaites rejoindre à nouveau notre serveur, pas de soucis ! Tu peux le rejoindre en passant par ce lien : <https://discord.gg/spdt>.
Au plaisir de te revoir 👋`;

const sendTimeoutWarningMessage = async (member, rawMessage) => {
  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Sending warning before timeout message for ${member.username}...`,
    'info',
  );

  const guild = await Store.client.guilds
    .fetch(process.env.DISCORD_SERVER_ID)
    .catch(Logger.error);

  const discordMember = await guild.members
    .fetch(member.memberId)
    .catch(Logger.error);

  const { message } = new Message(rawMessage, {
    channelId: member.LinkedChannel.discordId,
  });

  await discordMember.send(message).catch(Logger.error);

  // eslint-disable-next-line no-param-reassign
  member.warnsForInactivity += 1;
  await member.save();

  loader.succeed();
  Logger.info(`Timeout message sent successfully for ${member.username} !`);
};

const timeoutMember = async (member) => {
  const dataLoader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Processing timeout kick for ${member.username}...`,
    'info',
  );

  const guild = await Store.client.guilds
    .fetch(process.env.DISCORD_SERVER_ID)
    .catch(Logger.error);

  dataLoader.succeed();
  Logger.info(`${member.username}'s data successfully deleted !`);

  const kickLoader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Kicking ${member.username} from server ...`,
    'info',
  );

  const discordMember = await guild.members
    .fetch(member.memberId)
    .catch(Logger.error);

  await discordMember.send(TIMEOUT_MESSAGE);
  await discordMember
    .kick(`Kick pour non-réponse au workflow d'entrée`)
    .catch(Logger.error);

  kickLoader.succeed();
  Logger.info(`${member.username} successfully kicked of server !`);
};

const getInactiveMembers = async () => {
  const membersToWarnAfterOneDayInactivity = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 0,
      lastUpdateAt: {
        [Op.lt]: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
    },
    include: [{ model: LinkedChannel }],
  });

  const membersToWarnHalfTimeBeforeTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 1,
      lastUpdateAt: {
        [Op.lt]: new Date(
          Date.now() - (TIMEOUT_IN_DAYS / 2) * 24 * 3600 * 1000,
        ),
      },
    },
    include: [{ model: LinkedChannel }],
  });

  const membersToWarnLastDayBeforeTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 2,
      lastUpdateAt: {
        [Op.lt]: new Date(
          Date.now() - (TIMEOUT_IN_DAYS - 1) * 24 * 3600 * 1000,
        ),
      },
    },
    include: [{ model: LinkedChannel }],
  });

  const membersToTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 3,
      lastUpdateAt: {
        [Op.lt]: new Date(Date.now() - TIMEOUT_IN_DAYS * 24 * 3600 * 1000),
      },
    },
    include: [{ model: LinkedChannel }],
  });

  return {
    membersToWarnAfterOneDayInactivity,
    membersToWarnHalfTimeBeforeTimeout,
    membersToWarnLastDayBeforeTimeout,
    membersToTimeout,
  };
};

/**
 * @description Function that is get all unresponsive members to timeout
 * and fires event called `App_getUserOutOfPipe`.
 *
 * @event module:Libraries/EventBus#App_timeoutUsers
 *
 * @returns { Promise<void> }
 *
 * @example
 * await EventBus.emit({ event: 'App_timeoutUsers' });
 */
export default async () => {
  /* eslint-disable no-await-in-loop,no-restricted-syntax */
  const {
    membersToWarnAfterOneDayInactivity,
    membersToWarnHalfTimeBeforeTimeout,
    membersToWarnLastDayBeforeTimeout,
    membersToTimeout,
  } = await getInactiveMembers();

  if (membersToWarnAfterOneDayInactivity.length !== 0) {
    Logger.info('Start warning members after one day of inactivity');
    for (const member of membersToWarnAfterOneDayInactivity) {
      await sendTimeoutWarningMessage(member, ONE_DAY_INACTIVITY_MESSAGE);
    }
    Logger.info('Finished warning members after one day of inactivity');
  }

  // ---
  if (membersToWarnHalfTimeBeforeTimeout.length !== 0) {
    Logger.info(
      'Start warning members after half time remaining before timeout',
    );
    for (const member of membersToWarnHalfTimeBeforeTimeout) {
      await sendTimeoutWarningMessage(
        member,
        HALF_TIME_BEFORE_TIMEOUT_INACTIVITY_MESSAGE,
      );
    }
    Logger.info(
      'Finished warning members after half time remaining before timeout',
    );
  }

  // ---

  if (membersToWarnLastDayBeforeTimeout.length !== 0) {
    Logger.info('Start warning members one day before timeout');
    for (const member of membersToWarnLastDayBeforeTimeout) {
      await sendTimeoutWarningMessage(
        member,
        LAST_DAY_BEFORE_TIMEOUT_INACTIVITY_MESSAGE,
      );
    }
    Logger.info('Finished warning members one day before timeout');
  }

  // ---

  if (membersToTimeout.length !== 0) {
    Logger.info('Start timing out members');
    for (const member of membersToTimeout) {
      await timeoutMember(member);
    }
    Logger.info('Finished timing out members');
  }
  /* eslint-enable no-await-in-loop,no-restricted-syntax */
};
