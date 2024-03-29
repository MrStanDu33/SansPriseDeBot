/**
 * @file Process members from the wait list.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember, FollowedMember } = models;

/**
 * @description Function that process awaiting member.
 * It takes at max 10 members from the database, remove them from wait list
 * and insert them in pipe.
 *
 * @event module:Libraries/EventBus#App_processAwaitingMembers
 *
 * @returns { Promise<void> }
 *
 * @fires module:Libraries/EventBus#App_initializePipe
 *
 * @example
 * await EventBus.emit({ event: 'App_processAwaitingMembers' });
 */
export default async () => {
  Logger.info('Start processing missed members');
  // TODO: Delete this after all users has been synced
  const historicalMembersInProcess = await FollowedMember.findAll({
    where: {
      inProcess: true,
      isNewComer: false,
    },
  });

  const limit =
    Number(process.env.MAX_AWAITING_MEMBERS_BATCH_SIZE) -
    historicalMembersInProcess.length;

  const awaitingMembersToProcess = await AwaitingMember.findAll({
    order: [['priority', 'DESC']],
    limit: limit < 0 ? 0 : limit,
  });
  Logger.warn(
    `count of members actually in process: ${historicalMembersInProcess.length}`,
  );
  Logger.warn(
    `places left: ${
      Number(process.env.MAX_AWAITING_MEMBERS_BATCH_SIZE) -
      historicalMembersInProcess.length
    }`,
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const member of awaitingMembersToProcess) {
    Logger.info(`Starting processing awaiting member: ${member.username}`);

    try {
      // eslint-disable-next-line no-await-in-loop
      const guild = await Store.client.guilds.fetch(
        process.env.DISCORD_SERVER_ID,
      );
      // eslint-disable-next-line no-await-in-loop
      const guildMember = await guild.members.fetch(member.memberId);

      // TODO: delete this after all users has been synced (and newComer property in model)
      const isNewComer = false;
      // eslint-disable-next-line no-await-in-loop
      await EventBus.emit({
        event: 'App_initializePipe',
        args: [guildMember, isNewComer],
        async: false,
      });
    } catch (error) {
      Logger.warn(
        `Unable to process awaiting member ${member.username}`,
        error,
      );
    } finally {
      // eslint-disable-next-line no-await-in-loop
      await member.destroy();
    }
  }

  Logger.info('Finished processing missed members');
};
