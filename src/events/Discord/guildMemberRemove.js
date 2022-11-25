/**
 * @file Handle "user left" event from discord by removing member from pipe.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger/index';
import models from '$src/Models';
import EventBus from '$src/EventBus';

const { LinkedChannel, FollowedMember } = models;

/** @typedef { import('discord.js').GuildMember } Member */

/**
 * @description Function that is called when a member leaves the server.
 * If member was not followed by the bot, nothing happens.
 * Else, it removes the member welcome channel and removes member from the followed members list.
 *
 * @event module:Libraries/EventBus#Discord_guildMemberRemove
 *
 * @param   { Member }        member - Member that left the server.
 *
 * @returns { Promise<void> }
 *
 * @example
 * await EventBus.emit({ event: 'Discord_guildMemberRemove' });
 */
export default async (member) => {
  if (process.env.DRY_RUN === 'true') return;
  /**
   * TODO: Detect on boot diff between channels on db and users on server.
   * If so => delete channel and record !
   */
  Logger.info(`A member just left ! (${member.user.tag})`);

  // TODO: Move rest of code in getUserOutOfPipe event.
  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Deleting welcome channel and user data for ${member.user.tag}`,
    'info',
  );

  const followedMember = await FollowedMember.findOne({
    where: { memberId: member.user.id },
    include: [LinkedChannel],
  });

  if (followedMember === null) return;

  try {
    await EventBus.emit({
      event: 'App_getOutOfPipe',
      args: [followedMember],
    }).catch(() => {
      throw new Error(
        `An error has occurred while deleting welcome channel for ${member.user.tag}!`,
      );
    });

    await followedMember.destroy().catch(() => {
      throw new Error(
        `An error has occurred while deleting user ${member.user.tag} from database !`,
      );
    });

    loader.succeed();

    Logger.info(`${followedMember.username}'s data successfully deleted !`);
  } catch (error) {
    loader.fail();
    Logger.error(error.message, true);
    throw new Error(error);
  }
};
