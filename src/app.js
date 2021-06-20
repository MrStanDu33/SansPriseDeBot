import Discord from 'discord.js';
import Logger from '$src/Logger';

import Store from '$src/Store';
import Ready from '$src/events/ready';
import GuildMemberAdd from '$src/events/guildMemberAdd';

export default () => {
  Logger.info('Starting Discord.js client');
  if (!Store.client) {
    Store.client = new Discord.Client();
  }

  const loader = Logger.loader(
    { spinner: 'aesthetic', color: 'cyan' },
    'Connecting Discord bot to Discord ...',
    'info',
  );
  Store.client.login(process.env.DISCORD_BOT_TOKEN);
  Store.client.on('ready', () => {
    Ready(loader);
  });
  Store.client.on('guildMemberAdd', GuildMemberAdd);
};
