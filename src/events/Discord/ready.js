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

  //   cron.schedule('00 09 07 03 *', async () => {
  //     const { DISCORD_SERVER_ID } = process.env;

  //     if (client === undefined || !client.isReady()) return;

  //     const guild = await client.guilds.fetch(DISCORD_SERVER_ID);
  //     const channel = await guild.channels.fetch('654691903496912914');
  //     const msg = await channel.send({
  //       content: `
  // Bonjour @everyone,

  // Suite à de nombreux retours de la part de membres de la communauté concernant des tentatives de contact en messages privés pour déléguer la conception de projets de formation contre rémunération, ce qui correspond à de la triche.
  // Nous venons de mettre à jour les amendements du <#646357783616290876> afin d'améliorer la sécurité de chacun.
  // La nouvelle règle est la suivante :

  // :nine: Il est interdit d'utiliser les canaux du serveur ou de contacter en messages privés les membres de la communauté à des fins de triche ou de délégation pour la conception de projet de formation.

  // Si vous remarquez un comportement suspect du type de messages douteux comme cité précédemment, nous vous invitons à nous en faire part en ouvrant un ticket dans le salon <#1046828746826584125>.

  // Faites attention à toute sollicitation en messages privés, de nombreuses vagues de hameçonnages traînent sur Discord.
  // Essayez de ne cliquer sur aucun lien, ne scanner aucun QR code et ne télécharger aucun fichier envoyés en message privé de la part d'inconnus.
  // Cela peut paraître banal pour beaucoup mais malheureusement c'est nécessaire de le rappeler à tous.

  // Afin de garantir votre sécurité, nous vous recommandons de désactiver les messages privés provenant de membres inconnus du serveur en faisant un clic droit sur l'\`icône du serveur\` <:spdt:1175583032221126708> > \`Paramètres de confidentialité\` > \`Désactiver les messages privés\`.
  // Cela aura pour effet de bloquer tous les messages privés provenant des membres du serveurs avec lesquels vous n'êtes pas amis.

  // Merci de votre vigilance :police_officer:
  // Le <@&891323492711153725> <:spdt:1175583032221126708>`,
  //     });
  //   });
};
