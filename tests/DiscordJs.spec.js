import { Client, Intents } from 'discord.js';
import { jest } from '@jest/globals';

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

    it('Should be able to connect to Discord API', () => {
      const clientConnected = jest.fn();

      const client = new Client({
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_WEBHOOKS,
          Intents.FLAGS.GUILD_MESSAGES,
        ],
      });

      client.on('ready', clientConnected);
      client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
        expect(clientConnected).toHaveBeenCalled();
      });
    });
  });
});
