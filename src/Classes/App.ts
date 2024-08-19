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
 * @class
 * @description App instance.
 */
class App {
  Store: null | typeof Store;

  /**
   * @description Creates app and initialize Discord bot.
   *
   * @fires module:Libraries/EventBus#Discord_ready
   * @fires module:Libraries/EventBus#App_syncDbOnBoot
   *
   * @example
   * new App();
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
        IntentsBitField.Flags.MessageContent,
      );
      this.Store.client = new Client({
        intents,
      });
    }
    const loader = Logger.loader(
      { spinner: 'aesthetic', color: 'cyan' },
      'Connecting Discord bot to Discord ...',
      'info',
    );

    void this.Store.client
      .login(process.env.DISCORD_BOT_TOKEN)
      .catch((err: unknown) => {
        Logger.error(err);
      });

    this.Store.client.on('ready', () => {
      void EventBus.emit({
        event: 'Discord_ready',
        args: [loader],
        async: false,
      });
      void EventBus.emit({ event: 'App_syncDbOnBoot', async: false });

      App.setCronJobs();
    });

    this.Store.client.on('shardError', (error) => {
      Logger.error(true, 'A websocket connection encountered an error:', error);
    });
  }

  /**
   * @description It sets up cron jobs.
   * - One to timeout unresponsive users.
   * - One to process members missed by the bot in waiting list.
   *
   * @fires module:Libraries/EventBus#App_timeoutUsers
   * @fires module:Libraries/EventBus#App_processAwaitingMembers
   *
   * @example
   * App.setCronJobs();
   */
  static setCronJobs() {
    if (process.env.TIMEOUT_BATCH_FREQUENCY === undefined) return;

    const timeoutBatchFrequency = `*/${process.env.TIMEOUT_BATCH_FREQUENCY} * * * *`;
    cron.schedule(timeoutBatchFrequency, () => {
      void EventBus.emit({ event: 'App_timeoutUsers' });
    });

    if (process.env.AWAITING_MEMBERS_BATCH_FREQUENCY === undefined) return;

    const awaitingMembersBatchFrequency = `*/${process.env.AWAITING_MEMBERS_BATCH_FREQUENCY} * * * *`;
    cron.schedule(awaitingMembersBatchFrequency, () => {
      void EventBus.emit({ event: 'App_processAwaitingMembers' });
    });
  }
}

export default App;
