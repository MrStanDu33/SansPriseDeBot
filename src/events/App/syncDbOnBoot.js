/**
 * @file Sync members from server and members from database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/** @typedef { import('discord.js').GuildMember } GuildMember */
/** @typedef { import('discord.js').Role } Role */

import Logger from '$src/Logger';
import Store from '$src/Store';
import EventBus from '$src/EventBus';
import models from '$src/Models';

const { AwaitingMember, FollowedMember, LinkedChannel } = models;

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
  level75: {
    id: '849789635785785404',
  },
  level100: {
    id: '849789694346657802',
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
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level100.role)) {
    return 100;
  }
  if (roles.includes(ACTIVITY_LEVEL_ROLES.level75.role)) {
    return 75;
  }
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
 * @description Creates an awaiting member for each given members.
 *
 * @param   { GuildMember[] } members - Discord member to add to waitlist.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const guild = await Store.client.guilds.fetch(process.env.DISCORD_SERVER_ID);
 *
 * const membersOnServer = await guild.members
 *   .fetch()
 *   .map(([id, member]) => member);
 *
 * await syncMissingMembersInWaitList(membersOnServer);
 */
const syncMissingMembersInWaitList = async (members) => {
  members.forEach(async (member) => {
    try {
      const isMemberFollowed = await FollowedMember.findOne({
        where: { memberId: member.user.id },
      });

      const isMemberAwaiting = await AwaitingMember.findOne({
        where: { memberId: member.user.id },
      });

      if (isMemberFollowed !== null || isMemberAwaiting !== null) return;

      const memberRolesIds = member.roles.cache
        .map(({ id }) => id)
        .filter((roleId) => roleId !== member.guild.roles.everyone.id);

      await AwaitingMember.create({
        // eslint-disable-next-line no-underscore-dangle
        existingRoles: JSON.stringify(memberRolesIds),
        locale: member.user.locale || process.env.DEFAULT_LOCALE,
        memberId: member.user.id,
        username: member.user.tag,
        // eslint-disable-next-line no-underscore-dangle
        priority: getUserPriority([...member.roles.cache.values()]),
      });
    } catch (error) {
      Logger.error(error);
    }
  });
};

/**
 * @description It fetches all the members of the server but bots / system users,
 * keeps only the ones that are not already followed by the bot or awaiting, and
 * then creates an awaiting member for each of them.
 *
 * @param   { (FollowedMember|AwaitingMember)[] } followedMembers - Discord member to untrack.
 *
 * @returns { Promise<void> }
 *
 * @example
 * const followedMembers = await FollowedMember.findAll();
 *
 * await syncFollowedMembersThatHaveLeft(followedMembers);
 */
const syncFollowedMembersThatHaveLeft = async (followedMembers) => {
  followedMembers.forEach(async (member) => {
    const loader = Logger.loader(
      { spinner: 'dots10', color: 'cyan' },
      `Deleting welcome channel and user data for ${member.username}`,
      'info',
    );

    await EventBus.emit({ event: 'App_getOutOfPipe', args: [member] });

    await member.destroy().catch(() => {
      throw new Error(
        `An error has occurred while deleting user ${member.username} from database !`,
      );
    });

    loader.succeed();

    Logger.info(`${member.username}'s data successfully deleted !`);
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

  const guild = await Store.client.guilds
    .fetch(process.env.DISCORD_SERVER_ID)
    .catch(Logger.error);

  // eslint-disable-next-line no-restricted-syntax
  for (const activityLevelRoleKey of Object.keys(ACTIVITY_LEVEL_ROLES)) {
    const roleToFetch = ACTIVITY_LEVEL_ROLES[activityLevelRoleKey];
    // eslint-disable-next-line no-await-in-loop
    const role = await guild.roles.fetch(roleToFetch.id);
    roleToFetch.role = role;
  }

  const membersOnServer = await guild.members.fetch().catch(Logger.error);
  const membersIdsOnServer = [...membersOnServer].map((member) => member[0]);

  const followedMembers = await FollowedMember.findAll({
    include: [LinkedChannel],
  }).catch(Logger.error);
  const awaitingMembers = await AwaitingMember.findAll().catch(Logger.error);

  const membersTracked = [...followedMembers, ...awaitingMembers];
  const membersIdsTracked = membersTracked.map(({ memberId }) => memberId);

  const discordTestMembersWhitelistActive =
    process.env.DISCORD_TEST_MEMBERS_WHITELIST_ACTIVE === 'true';
  const discordTestMembersWhitelist =
    process.env.DISCORD_TEST_MEMBERS_WHITELIST?.split(',') || [];

  const discordMembersToFollow = [...membersOnServer]
    // eslint-disable-next-line no-unused-vars
    .map(([, member]) => member)
    .filter((member) => !membersIdsTracked.includes(member.user.id))
    .filter((member) => {
      if (member.user.bot) return false;
      if (member.user.system) return false;

      if (
        discordTestMembersWhitelistActive &&
        !discordTestMembersWhitelist.includes(member.user.id)
      )
        return false;
      return true;
    });

  const followedMembersToUnfollow = [...membersTracked].filter(
    (member) => !membersIdsOnServer.includes(member.memberId),
  );

  Logger.info(
    `${discordMembersToFollow.length} members has joined the server while bot was off and are not tracked, adding them to waiting list...`,
  );
  Logger.debug(
    'List of all members to follow: ',
    JSON.stringify(discordMembersToFollow.map(({ user }) => user)),
  );

  Logger.info(
    `${followedMembersToUnfollow.length} members has left the server while bot was off and are not tracked, untracking them ...`,
  );
  Logger.debug(
    'List of all members to untrack: ',
    JSON.stringify(followedMembersToUnfollow),
  );

  await syncMissingMembersInWaitList(discordMembersToFollow);
  await syncFollowedMembersThatHaveLeft(followedMembersToUnfollow);

  Logger.info('End of Db syncing');
};
