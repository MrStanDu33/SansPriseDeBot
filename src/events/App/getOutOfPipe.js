/**
 * @file Delete followed member's linked channel and archive followed member.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';
import models from '$src/Models';
import Store from '$src/Store';

const { FollowedMember } = models;

/**
 * @description Get user out of pipe by deleting linked channel
 * and updating tracking status in database.
 *
 * @event module:Libraries/EventBus#App_getOutOfPipe
 *
 * @param   { FollowedMember }          member - Followed member to untrack.
 *
 * @returns { Promise<boolean | void> }        - Returns false if action is not in list of
 *                                             allowed actions. Returns undefined if
 *                                             action was done.
 *
 * @example
 * const member = await FollowedMember.findOne({
 *   where: { id: memberId },
 *   include: { all: true },
 * });
 * await EventBus.emit({ event: 'App_getOutOfPipe', args: [ member ] });
 */
export default async (member) => {
  Logger.info(`Getting ${member.username} out of pipe.`);
  const { client } = Store;

  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);

  if (member.LinkedChannel !== null && member.LinkedChannel !== undefined) {
    const channelName = member.LinkedChannel.name;
    try {
      const channelToDelete = await guild.channels.fetch(
        member.LinkedChannel.discordId,
      );

      await channelToDelete.delete(
        member.LinkedChannel.discordId,
        'User got out of pipe',
      );

      if ([...channelToDelete.parent.children.cache].length === 0) {
        await channelToDelete.parent.delete();
        Logger.info(`Parent category successfully deleted`);
      }

      Logger.info(`Channel ${channelName} successfully deleted !`);
    } catch (e) {
      Logger.warn(
        `Asked to delete channel ${channelName} but channel does not exist anymore !`,
      );
    } finally {
      await member.LinkedChannel.destroy();
    }
  }

  /* eslint-disable no-param-reassign */
  member.inProcess = false;
  member.isNewComer = false;
  member.warnsForInactivity = 0;
  /* eslint-enable no-param-reassign */
  member.save();
};
