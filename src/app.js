/**
 * @file App initialization.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { Client, IntentsBitField } from 'discord.js';
import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
import '$src/events/';
import cron from 'node-cron';

/**
 * @class App
 */
class App {
  /**
   * @description Creates app and initialize Discord bot.
   *
   * @category App
   */
  constructor() {
    this.Store = Store;

    Logger.info('Starting Discord.js client');
    if (!this.Store.client) {
      // TODO: Review discord Intents for more security
      const intents = new IntentsBitField();
      intents.add(
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.GuildMessages,
      );
      this.Store.client = new Client({
        intents,
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

      App.setCronJobs();
    });

    Store.client.on('shardError', (error) => {
      Logger.error(true, 'A websocket connection encountered an error:', error);
    });
  }

  /**
   * @description It sets up cron jobs.
   * - One to timeout unresponsive users.
   * - One to process members missed by the bot in waiting list.
   */
  static setCronJobs() {
    cron.schedule('* * * * *', () => EventBus.emit('App_timeoutUsers'));
    cron.schedule('* * * * *', () => EventBus.emit('App_processMissedMembers'));
  }
}

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
