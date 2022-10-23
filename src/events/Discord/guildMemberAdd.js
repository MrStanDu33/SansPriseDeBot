/**
 * @file Handle "new user" event from discord by inserting member in pipe.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import EventBus from '$src/EventBus';
import Logger from '$src/Logger';

/** @typedef { import('discord.js').GuildMember } Member */

/**
 * @description Function that is called when a new member joins the server.
 * It fires event called `App_initializePipe`.
 *
 * @param { Member } member - Member that just joined the server.
 */
export default (member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return;

  Logger.info(`New member just came ! (${member.user.tag})`);
  EventBus.emit('App_initializePipe', member);
};
