/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember } = models;

const membersBatchSize = 10;

export default async () => {
  Logger.info('Start processing missed members');

  const awaitingMembersCount = await AwaitingMember.count();
  // eslint-disable-next-line operator-linebreak
  const maxIndex =
    membersBatchSize > awaitingMembersCount
      ? awaitingMembersCount
      : membersBatchSize;

  const iterations = [...Array(maxIndex).keys()];

  // eslint-disable-next-line no-restricted-syntax,no-unused-vars
  for (const iteration of iterations) {
    // eslint-disable-next-line no-await-in-loop
    const rawAwaitingMember = await AwaitingMember.findOne({
      order: [
        ['priority', 'DESC'],
        ['id', 'ASC'],
      ],
    });
    rawAwaitingMember.destroy();

    Store.client.guilds
      .fetch(process.env.DISCORD_SERVER_ID)
      .then((guild) => guild.members.fetch(rawAwaitingMember.memberId))
      .then((member) => EventBus.emit('App_initializePipe', member));
  }

  Logger.info('Finished processing missed members');
};
