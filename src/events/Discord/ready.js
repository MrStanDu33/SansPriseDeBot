import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';

export default (loader) => {
  const { client } = Store;

  loader.succeed();
  Logger.info(`Logged in as ${Store.client.user.tag}!`);

  client.on('guildMemberAdd', (member) =>
    EventBus.emit('Discord_guildMemberAdd', member),
  );

  client.on('guildMemberRemove', (member) =>
    EventBus.emit('Discord_guildMemberRemove', member),
  );

  client.on('interactionCreate', (interaction) =>
    EventBus.emit('Discord_interactionCreate', interaction),
  );
};
