import Discord from 'discord.js';
import Logger from '$src/Logger';

import Store from '$src/Store';
import Ready from '$src/events/Discord/ready';
import GuildMemberAdd from '$src/events/Discord/guildMemberAdd';

import Events from '$src/events/App/';

const App = {
  constructor() {
    this.Events = Events;
    this.Store = Store;

    Logger.info('Starting Discord.js client');
    if (!this.Store.client) {
      this.Store.client = new Discord.Client();
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
      Ready(loader);
    });
    this.Store.client.on('guildMemberAdd', GuildMemberAdd);
  },
};

export default App;
