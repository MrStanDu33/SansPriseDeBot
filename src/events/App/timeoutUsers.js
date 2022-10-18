/**
 * @file Get member out of pipe after an inactivity period.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger/index';
import models from '$src/Models';
import { Op } from '@sequelize/core';

const { FollowedMember } = models;

const timeoutInDays = 1;

export default async () => {
  const membersToTimeout = await FollowedMember.findOne({
    where: {
      lastUpdateAt: {
        [Op.gt]: new Date(Date.now() - timeoutInDays * 24 * 3600 * 1000),
      },
    },
  });

  membersToTimeout.forEach((member) => {
    // TODO: add timeout process
    Logger.info('userToTimeout', member);
  });
};
