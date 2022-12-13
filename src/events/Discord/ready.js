/**
 * @file Handle "bot connected" event from discord by setting up event listeners.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
// import { joinVoiceChannel } from '@discordjs/voice';

/** @typedef { import('ora').Ora } Loader */

/**
 * @description Function called when the bot is connected to discord.
 * It emits events expected to be ran on bot connection.
 *
 * @event module:Libraries/EventBus#Discord_ready
 *
 * @param { Loader } loader - Loader to stop as bot is logged.
 *
 * @fires module:Libraries/EventBus#Discord_guildMemberAdd
 * @fires module:Libraries/EventBus#Discord_guildMemberRemove
 * @fires module:Libraries/EventBus#Discord_interactionCreate
 * @fires module:Libraries/EventBus#Discord_messageCreate
 *
 * @example
 * await EventBus.emit({ event: 'Discord_ready' });
 */
export default async (loader) => {
  const { client } = Store;

  /* const channel = await client.channels.fetch('959821807383355392');

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: '595235640044552223',
    adapterCreator: channel.guild.voiceAdapterCreator,
  }); */

  loader.succeed();
  Logger.info(`Logged in as ${Store.client.user.tag}!`);

  client.on('guildMemberAdd', (member) =>
    EventBus.emit({ event: 'Discord_guildMemberAdd', args: [member] }),
  );

  client.on('guildMemberRemove', (member) =>
    EventBus.emit({ event: 'Discord_guildMemberRemove', args: [member] }),
  );

  client.on('interactionCreate', (interaction) =>
    EventBus.emit({ event: 'Discord_interactionCreate', args: [interaction] }),
  );

  client.on('messageCreate', (message) =>
    EventBus.emit({ event: 'Discord_messageCreate', args: [message] }),
  );

  client.application.commands
    .create({
      name: 'ping',
      description: 'Test for bot status',
    })
    .then(() => {
      Logger.info('Command `/ping` successfully registered');
    })
    .catch(Logger.error);
};
