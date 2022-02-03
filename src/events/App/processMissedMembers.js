import Logger from '$src/Logger';
import { logs } from '$src/Db';
import EventBus from '$src/EventBus';
import Store from '$src/Store';

const membersBatchSize = 10;

export default () => {
  Logger.info('Start processing missed members');

  const awaitingMembersCount = logs.count('/app/awaitingMembers');
  // eslint-disable-next-line operator-linebreak
  const maxIndex =
    membersBatchSize > awaitingMembersCount
      ? awaitingMembersCount
      : membersBatchSize;

  const iterations = [...Array(maxIndex).keys()];

  iterations.forEach(async () => {
    const rawAwaitingMember = logs.getData('/app/awaitingMembers[0]');
    logs.delete('/app/awaitingMembers[0]');

    const guild = await Store.client.guilds.fetch(
      process.env.DISCORD_SERVER_ID,
    );

    const member = await guild.members.fetch(rawAwaitingMember.id);

    EventBus.emit('App_initializePipe', member);
  });

  Logger.info('Finished processing missed members');
};
