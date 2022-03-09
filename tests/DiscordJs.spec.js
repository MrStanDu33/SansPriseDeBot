import { Client, Intents } from 'discord.js';
import { jest } from '@jest/globals';

jest.retryTimes(4);
jest.setTimeout(30000);

describe('Discord.js', () => {
  describe('Auth', () => {
    it('Should have environment variables set', () => {
      const {
        DISCORD_BOT_TOKEN: DiscordBotToken,
        DISCORD_SERVER_ID: DiscordServerId,
        DISCORD_WELCOME_CHANNEL_CATEGORY_ID: DefaultWelcomeChannelCategoryId,
      } = process.env;

      expect(DiscordBotToken).toBeTruthy();
      expect(DiscordServerId).toMatch(/[\d]{18}/);
      expect(DefaultWelcomeChannelCategoryId).toMatch(/[\d]{18}/);
    });

    it('Should be able to connect to Discord API', async () => {
      const clientConnected = jest.fn();

      const client = new Client({
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_WEBHOOKS,
        ],
      });

      client.on('ready', clientConnected);

      await client.login(process.env.DISCORD_BOT_TOKEN);

      expect(clientConnected).toHaveBeenCalled();
    });
  });
});
