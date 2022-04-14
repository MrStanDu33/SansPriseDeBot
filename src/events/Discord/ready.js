import Store from '$src/Store';
import Logger from '$src/Logger';
import EventBus from '$src/EventBus';
// import { joinVoiceChannel } from '@discordjs/voice';

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
    EventBus.emit('Discord_guildMemberAdd', member),
  );

  client.on('guildMemberRemove', (member) =>
    EventBus.emit('Discord_guildMemberRemove', member),
  );

  client.on('interactionCreate', (interaction) =>
    EventBus.emit('Discord_interactionCreate', interaction),
  );
};
