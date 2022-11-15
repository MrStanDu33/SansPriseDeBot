/**
 * @file Get member out of pipe after an inactivity period.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger/index';
import models from '$src/Models';
import { Op } from '@sequelize/core';

const { FollowedMember } = models;

/** @typedef { import('$src/Models/FollowedMember').default } Member */

const timeoutInDays = 1;

/**
 * @description Function that is get all unresponsive members to timeout
 * and fires event called `App_getUserOutOfPipe`.
 *
 * @event module:Libraries/EventBus#App_timeoutUsers
 *
 * @returns { Promise<void> }
 *
 * @example
 * EventBus.emit('App_timeoutUsers');
 */
export default async () => {
  const membersToTimeout = await FollowedMember.findAll({
    where: {
      lastUpdateAt: {
        [Op.lt]: new Date(Date.now() - timeoutInDays * 24 * 3600 * 1000),
      },
    },
  });

  if (membersToTimeout === null) return;

  membersToTimeout.forEach((/** @type {Member} */ member) => {
    // TODO: add timeout process and fire getUserOutOfPipe event
    Logger.info('userToTimeout', member);
  });
};
