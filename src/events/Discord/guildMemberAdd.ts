/**
 * @file Handle "new user" event from discord by inserting member in pipe.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import EventBus from '$src/EventBus';
import Logger from '$src/Logger';

type Member = import('discord.js').GuildMember;

/**
 * @description Function that is called when a new member joins the server.
 * It fires event called `App_initializePipe`.
 *
 * @event module:Libraries/EventBus#Discord_guildMemberAdd
 *
 * @param { Member } member - Member that just joined the server.
 *
 * @fires module:Libraries/EventBus#App_initializePipe
 *
 * @example
 * await EventBus.emit({ event: 'Discord_guildMemberAdd' });
 */
export default (member: Member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return;

  const whitelistEnabled =
    process.env.DISCORD_TEST_MEMBERS_WHITELIST_ACTIVE === 'true';
  const membersWhitelist =
    process.env.DISCORD_TEST_MEMBERS_WHITELIST.split(',');

  if (whitelistEnabled && !membersWhitelist.includes(member.id)) return;

  Logger.info(`New member just came ! (${member.user.tag})`);
  void EventBus.emit({ event: 'App_initializePipe', args: [member] });
};
