/**
 * @file Test discord.js bot authentication.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */
// @ts-nocheck

import { Client, IntentsBitField } from 'discord.js';
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
      const intents = new IntentsBitField();

      intents.add(
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.GuildMessages,
      );

      const client = new Client({ intents });

      client.on('ready', clientConnected);
      client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
        expect(clientConnected).toHaveBeenCalled();
      });
    });
  });
});
