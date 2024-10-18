/**
 * @file Get member out of pipe after an inactivity period.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import Store from '$src/Store';
import { FollowedMember, LinkedChannel } from '$src/Models';
import Message from '$src/Classes/Message';
import { Op } from '@sequelize/core';
import { GuildTextBasedChannel } from 'discord.js';

const ONE_DAY_INACTIVITY_MESSAGE = `Bonjour <@{{ memberId }}>, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement pas encore répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.

Au plaisir de te revoir 👋`;
const HALF_TIME_BEFORE_TIMEOUT_INACTIVITY_MESSAGE = `Bonjour <@{{ memberId }}>, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement toujours pas répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.
Si tu n'y réponds pas dans les prochains jours, tu risque d'être ejecté du serveur.

Au plaisir de te revoir 👋`;
const LAST_DAY_BEFORE_TIMEOUT_INACTIVITY_MESSAGE = `Bonjour <@{{ memberId }}>, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Tu n'as malheureusement toujours pas répondu à mes questions.
Dans le souhait de proposer l'expérience la plus agréable à tous nos utilisateurs, je t'invite à y répondre afin de pouvoir débloquer toutes les fonctionnalités du serveur.
Si nous n'avons pas de réponse de ta part à mes questions, nous seront dans l'obligation de t'éjecter du serveur.

Au plaisir de te revoir 👋`;
const TIMEOUT_MESSAGE = `Bonjour, je suis Sans prise de bot, le robot du serveur Sans prise de tech.

Malheureusement, tu n'as pas pris le temps de répondre à mes questions.
Pour des raisons de limitation technique de la plateforme Discord, j'étais dans l'obligation de te retirer du serveur.

Si tu souhaites rejoindre à nouveau notre serveur, pas de soucis ! Tu peux le rejoindre en passant par ce lien : <https://discord.gg/spdt>.
Au plaisir de te revoir 👋`;

/**
 * @description Send a warning to the member who is inactive.
 *
 * @param {FollowedMember} member  - The member to send a warning message.
 * @param {string}         message - The message to send to the member.
 */
const sendTimeoutWarningMessage = async (
  member: FollowedMember,
  message: string,
) => {
  try {
    const loader = Logger.loader(
      { spinner: 'dots10', color: 'cyan' },
      `Sending warning before timeout message for ${member.username}...`,
      'info',
    );

    // eslint-disable-next-line no-param-reassign
    member.warnsForInactivity += 1;
    await member.save();

    const { message: dmMessage } = new Message(message, {
      memberId: member.memberId,
    });
    if (!member.linkedChannel?.discordId)
      throw new Error('Linked channel not found');

    const { message: channelLinkMessage } = new Message(
      'Tu peux retrouver notre conversation pour la continuer ici: <#{{ channelId }}>',
      {
        channelId: member.linkedChannel.discordId,
      },
    );
    // @ts-expect-error: Client must exist.
    const guild = await Store.client.guilds.fetch(
      process.env.DISCORD_SERVER_ID,
    );
    const memberChannel = (await guild.channels.fetch(
      member.linkedChannel.discordId,
    )) as GuildTextBasedChannel | null;
    if (memberChannel === null)
      throw new Error(
        `Unable to find discord channel with ID ${
          member.linkedChannel.discordId
        }`,
      );
    await memberChannel.send(dmMessage);

    const discordMember = await guild.members.fetch(member.memberId);

    await discordMember.send(dmMessage);
    await discordMember.send(channelLinkMessage);

    loader.succeed();
    Logger.info(`Timeout message sent successfully for ${member.username} !`);
  } catch (e: unknown) {
    Logger.error(e);
  }
};

/**
 * @description Timeout a member who has been inactive for too long time.
 *
 * @param {FollowedMember} member - The member to timeout.
 */
const timeoutMember = async (member: FollowedMember) => {
  try {
    const dataLoader = Logger.loader(
      { spinner: 'dots10', color: 'cyan' },
      `Processing timeout kick for ${member.username}...`,
      'info',
    );
    // @ts-expect-error: Client must exist.
    const guild = await Store.client.guilds.fetch(
      process.env.DISCORD_SERVER_ID,
    );

    dataLoader.succeed();
    Logger.info(`${member.username}'s data successfully deleted !`);

    const kickLoader = Logger.loader(
      { spinner: 'dots10', color: 'cyan' },
      `Kicking ${member.username} from server ...`,
      'info',
    );

    const discordMember = await guild.members.fetch(member.memberId);

    await discordMember.send(TIMEOUT_MESSAGE).catch((error: unknown) => {
      Logger.warn(
        `Unable to send timeout message to ${member.username}`,
        error,
      );
    });
    await discordMember.kick(`Kick pour non-réponse au workflow d'entrée`);

    kickLoader.succeed();
    Logger.info(`${member.username} successfully kicked of server !`);
  } catch (e: unknown) {
    Logger.error(e);
  }
};

/**
 * @description Get list of inactive members based on different inactivity durations.
 *
 * @returns { Promise<{
 * membersToWarnAfterOneDayInactivity: FollowedMember[];
 * membersToWarnHalfTimeBeforeTimeout: FollowedMember[];
 * membersToWarnLastDayBeforeTimeout: FollowedMember[];
 * membersToTimeout: FollowedMember[];
 * }> } - A list of inactive members.
 */
const getInactiveMembers = async (): Promise<{
  membersToWarnAfterOneDayInactivity: FollowedMember[];
  membersToWarnHalfTimeBeforeTimeout: FollowedMember[];
  membersToWarnLastDayBeforeTimeout: FollowedMember[];
  membersToTimeout: FollowedMember[];
}> => {
  const membersToWarnAfterOneDayInactivity = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 0,
      lastUpdateAt: {
        [Op.lt]: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
    },
    include: [{ model: LinkedChannel }],
    limit: Number(process.env.MAX_TIMEOUT_BATCH_SIZE),
  });

  const membersToWarnHalfTimeBeforeTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 1,
      lastUpdateAt: {
        [Op.lt]: new Date(
          Date.now() -
            (Number(process.env.TIMEOUT_IN_DAYS) / 2) * 24 * 3600 * 1000,
        ),
      },
    },
    include: [{ model: LinkedChannel }],
    limit: Number(process.env.MAX_TIMEOUT_BATCH_SIZE),
  });

  const membersToWarnLastDayBeforeTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 2,
      lastUpdateAt: {
        [Op.lt]: new Date(
          Date.now() -
            (Number(process.env.TIMEOUT_IN_DAYS) - 1) * 24 * 3600 * 1000,
        ),
      },
    },
    include: [{ model: LinkedChannel }],
    limit: Number(process.env.MAX_TIMEOUT_BATCH_SIZE),
  });

  const membersToTimeout = await FollowedMember.findAll({
    where: {
      inProcess: true,
      warnsForInactivity: 3,
      lastUpdateAt: {
        [Op.lt]: new Date(
          Date.now() - Number(process.env.TIMEOUT_IN_DAYS) * 24 * 3600 * 1000,
        ),
      },
    },
    include: [{ model: LinkedChannel }],
    limit: Number(process.env.MAX_TIMEOUT_BATCH_SIZE),
  });

  return {
    membersToWarnAfterOneDayInactivity,
    membersToWarnHalfTimeBeforeTimeout,
    membersToWarnLastDayBeforeTimeout,
    membersToTimeout,
  };
};

/**
 * @description Warn a list of members who are inactive for one day.
 *
 * @param {FollowedMember[]} members - List of members to warn after one day of inactivity.
 */
const warnMemberAfterOneDayOfInactivity = async (members: FollowedMember[]) => {
  if (members.length !== 0) {
    Logger.info('Start warning members after one day of inactivity');
    // eslint-disable-next-line no-restricted-syntax
    for (const member of members) {
      // eslint-disable-next-line no-await-in-loop
      await sendTimeoutWarningMessage(member, ONE_DAY_INACTIVITY_MESSAGE);
    }
    Logger.info('Finished warning members after one day of inactivity');
  }
};

/**
 * @description Warn a list of members who are inactive for half of the given time.
 *
 * @param {FollowedMember[]} members - List of members to warn after half time before timeout.
 */
const warnMembersHalfTimeBeforeTimeout = async (members: FollowedMember[]) => {
  if (members.length !== 0) {
    Logger.info(
      'Start warning members after half time remaining before timeout',
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const member of members) {
      // eslint-disable-next-line no-await-in-loop
      await sendTimeoutWarningMessage(
        member,
        HALF_TIME_BEFORE_TIMEOUT_INACTIVITY_MESSAGE,
      );
    }
    Logger.info(
      'Finished warning members after half time remaining before timeout',
    );
  }
};

/**
 * @description Warn a list of members who ar about to be kicked in one day due to inactivity.
 *
 * @param {FollowedMember[]} members - List of members to warn last day before timeout.
 */
const warnMembersLastDayBeforeTimeout = async (members: FollowedMember[]) => {
  if (members.length !== 0) {
    Logger.info('Start warning members one day before timeout');
    // eslint-disable-next-line no-restricted-syntax
    for (const member of members) {
      // eslint-disable-next-line no-await-in-loop
      await sendTimeoutWarningMessage(
        member,
        LAST_DAY_BEFORE_TIMEOUT_INACTIVITY_MESSAGE,
      );
    }
    Logger.info('Finished warning members one day before timeout');
  }
};

/**
 * @description Timeout a list of members.
 *
 * @param {FollowedMember[]} members - List of members to timeout.
 */
const timeoutMembers = async (members: FollowedMember[]) => {
  if (members.length !== 0) {
    Logger.info('Start timing out members');
    // eslint-disable-next-line no-restricted-syntax
    for (const member of members) {
      // eslint-disable-next-line no-await-in-loop
      await timeoutMember(member);
    }
    Logger.info('Finished timing out members');
  }
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

  void warnMemberAfterOneDayOfInactivity(membersToWarnAfterOneDayInactivity);
  void warnMembersHalfTimeBeforeTimeout(membersToWarnHalfTimeBeforeTimeout);
  void warnMembersLastDayBeforeTimeout(membersToWarnLastDayBeforeTimeout);
  void timeoutMembers(membersToTimeout);
};
