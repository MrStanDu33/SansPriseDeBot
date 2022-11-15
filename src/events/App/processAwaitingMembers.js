/**
 * @file Process members from the wait list.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember } = models;

const AWAITING_MEMBERS_BATCH_SIZE = 10;

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
 * EventBus.emit('App_processAwaitingMembers');
 */
export default async () => {
  Logger.info('Start processing missed members');

  const awaitingMembersToProcess = await AwaitingMember.findAll({
    limit: AWAITING_MEMBERS_BATCH_SIZE,
  });

  const promises = awaitingMembersToProcess.map(async (member) => {
    member.destroy();

    const guild = await Store.client.guilds.fetch(
      process.env.DISCORD_SERVER_ID,
    );
    const guildMember = await guild.members.fetch(member.memberId);

    EventBus.emit('App_initializePipe', guildMember);
  });

  await Promise.all(promises);
  Logger.info('Finished processing missed members');
};
