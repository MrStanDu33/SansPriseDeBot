import { Client, Intents } from 'discord.js';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import '$src/events/';

const App = {
  async constructor() {
    this.Store = Store;

    Logger.info('Starting Discord.js client');
    if (!this.Store.client) {
      // TODO: Review discord Intents for more security
      this.Store.client = new Client({
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_WEBHOOKS,
        ],
      });
    }
    this.Store.client.login(process.env.DISCORD_BOT_TOKEN);
    this.setDiscordEvents();
  },

  setDiscordEvents() {
    const loader = Logger.loader(
      { spinner: 'aesthetic', color: 'cyan' },
      'Connecting Discord bot to Discord ...',
      'info',
    );

    this.Store.client.on('ready', () => {
      EventBus.emit('Discord_ready', loader);
      EventBus.emit('App_syncDbOnBoot');
    });

    this.Store.client.on('guildMemberAdd', () =>
      EventBus.emit('Discord_guildMemberAdd'),
    );

    this.Store.client.on('guildMemberRemove', () =>
      EventBus.emit('Discord_guildMemberRemove'),
    );
  },
};

export default App;

process.once('SIGUSR2', () => {
  Logger.info('Stopping Discord.js client');
  const loader = Logger.loader(
    { spinner: 'aesthetic', color: 'cyan' },
    'Disconnecting Discord bot to Discord ...',
    'info',
  );
  Store.client.destroy();
  loader.succeed();
  Logger.info('Discord bot successfully disconnected');
  process.kill(process.pid, 'SIGUSR2');
});
