import { Client, Intents } from 'discord.js';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import '$src/events/';
import cron from 'node-cron';

const App = {
  constructor() {
    this.Store = Store;

    Logger.info('Starting Discord.js client');
    if (!this.Store.client) {
      // TODO: Review discord Intents for more security
      this.Store.client = new Client({
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_WEBHOOKS,
          Intents.FLAGS.GUILD_MESSAGES,
        ],
      });
    }
    this.Store.client.login(process.env.DISCORD_BOT_TOKEN);

    const loader = Logger.loader(
      { spinner: 'aesthetic', color: 'cyan' },
      'Connecting Discord bot to Discord ...',
      'info',
    );

    Store.client.on('ready', () => {
      // const channel = Store.client.channels.cache.get('646359583895322645');
      // channel.send('Test de Julien à nouveau');

      EventBus.emit('Discord_ready', loader);
      EventBus.emit('App_syncDbOnBoot');

      this.setCronJobs();
    });
  },

  setCronJobs() {
    cron.schedule('* * * * *', () => EventBus.emit('App_timeoutUsers'));
    cron.schedule('* * * * *', () => EventBus.emit('App_processMissedMembers'));
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
