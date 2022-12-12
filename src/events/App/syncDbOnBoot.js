/**
 * @file Sync members from server and members from database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/** @typedef { import('discord.js').Collection } Collection */
/** @typedef { import('discord.js').Role } Role */

import Logger from '$src/Logger';
import Store from '$src/Store';
import models from '$src/Models';

const { AwaitingMember, FollowedMember } = models;

const ACTIVITY_LEVEL_ROLES = {
  level1: {
    id: '849789213167058985',
  },
  level5: {
    id: '849789381220892693',
  },
  level10: {
    id: '849789452162301982',
  },
  level25: {
    id: '849789508349722664',
  },
  level50: {
    id: '849789583221981185',
  },
};

/**
 * @description Gives a number proportional to member activity.
 *
 * @param   { Role[] } roles - A collection of member roles.
 *
 * @returns { number }       - The user's priority.
 *
 * @example
 * const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 * const member = await guild.members.fetch('691583992587354112');
 *
 * const userPriority = getUserPriority(member.roles);
 *
 * console.log(userPriority); // A number with a value that gets higher as user gets more active.
 */
const getUserPriority = (roles) => {
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level50.role)) {
    return 50;
  }
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level25.role)) {
    return 25;
  }
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level10.role)) {
    return 10;
  }
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level5.role)) {
    return 5;
  }
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level1.role)) {
    return 1;
  }
  return 0;
};

/**
 * @description It fetches all the members of the server but bots / system users,
 * keeps only the ones that are not already followed by the bot or awaiting, and
 * then creates an awaiting member for each of them.
 *
 * @returns { Promise<void> }
 *
 * @example
 * await syncMissingMembersInWaitList();
 */
const syncMissingMembersInWaitList = async () => {
  const guild = await Store.client.guilds
    .fetch(process.env.DISCORD_SERVER_ID)
    .catch(Logger.error);
  const guildMembers = await guild.members.fetch().catch(Logger.error);

  const rawMembersToForceInclude = process.env.DISCORD_MEMBERS_TO_FORCE_ONBOARD;
  const membersToForceInclude = rawMembersToForceInclude?.split(',') || [];

  const members = guildMembers.filter((member) => {
    if (membersToForceInclude.includes(member.user.id)) return true;
    if (member.user.bot) return false;
    if (member.user.system) return false;

    // if (member._roles.length !== 0) return false;
    // return true;

    // TODO: remove this return and enable public members to be processed
    return false;
  });

  members.each(async (member) => {
    try {
      const isMemberFollowed = await FollowedMember.findOne({
        where: { memberId: member.user.id },
      });

      const isMemberAwaiting = await AwaitingMember.findOne({
        where: { memberId: member.user.id },
      });

      if (isMemberFollowed !== null || isMemberAwaiting !== null) return false;

      await AwaitingMember.create({
        // eslint-disable-next-line no-underscore-dangle
        existingRoles: JSON.stringify(member._roles),
        locale: member.user.locale || process.env.DEFAULT_LOCALE,
        memberId: member.user.id,
        username: member.user.tag,
        // eslint-disable-next-line no-underscore-dangle
        priority: getUserPriority(member._roles),
      });
    } catch (error) {
      Logger.error(error);
    }
    return true;
  });
};

/**
 * @description Function called when the bot is started to sync database and members.
 * Every members in server that have no roles and are not followed by the bot will be followed.
 * Every members followed by the bot that are no longer in the server will be removed from database.
 *
 * @event module:Libraries/EventBus#App_syncDbOnBoot
 *
 * @returns { Promise<void> }
 *
 * @example
 * await EventBus.emit({ event: 'App_syncDbOnBoot' });
 */
export default async () => {
  Logger.info('Start syncing Db');

  const guild = await Store.client.guilds.fetch(process.env.DISCORD_SERVER_ID);

  // eslint-disable-next-line no-restricted-syntax
  for (const activityLevelRoleKey of Object.keys(ACTIVITY_LEVEL_ROLES)) {
    const roleToFetch = ACTIVITY_LEVEL_ROLES[activityLevelRoleKey];
    // eslint-disable-next-line no-await-in-loop
    const role = await guild.roles.fetch(roleToFetch.id);
    roleToFetch.role = role;
  }

  await syncMissingMembersInWaitList();
  // TODO: syncLeftFollowedMembers

  Logger.info('End of Db syncing');
};
