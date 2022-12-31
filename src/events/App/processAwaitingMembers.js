/**
 * @file Process members from the wait list.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember, FollowedMember } = models;

const MAX_AWAITING_MEMBERS_BATCH_SIZE = 20;

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
  const awaitingMembersToProcess = await AwaitingMember.findAll({
    limit: MAX_AWAITING_MEMBERS_BATCH_SIZE - historicalMembersInProcess.length,
  });
  Logger.error(
    `count of members actually in process: ${historicalMembersInProcess.length}`,
  );
  Logger.error(
    `places left: ${
      MAX_AWAITING_MEMBERS_BATCH_SIZE - historicalMembersInProcess.length
    }`,
  );

  const promises = awaitingMembersToProcess.map(async (member) => {
    Logger.info(`Starting processing awaiting member: ${member.username}`);

    try {
      const guild = await Store.client.guilds.fetch(
        process.env.DISCORD_SERVER_ID,
      );
      const guildMember = await guild.members.fetch(member.memberId);

      // TODO: delete this after all users has been synced (and newComer property in model)
      const isNewComer = false;
      await EventBus.emit({
        event: 'App_initializePipe',
        args: [guildMember, isNewComer],
      });
    } catch (error) {
      Logger.warn(
        `Unable to process awaiting member ${member.username}`,
        error,
      );
    } finally {
      member.destroy();
    }
  });

  await Promise.all(promises);
  Logger.info('Finished processing missed members');
};
