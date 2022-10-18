/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { logs } from '$src/Db';
import Logger from '$src/Logger/index';

const timeoutInDays = 1;

export default () => {
  const followingMembers = logs.getData('/app/followingMembers');

  const maxIdleTime = new Date(
    Date.now() - timeoutInDays * 24 * 3600 * 1000,
  ).getTime();

  const membersToTimeout = followingMembers.filter(
    (member) => maxIdleTime > member.lastUpdateAt,
  );

  membersToTimeout.forEach((member) => {
    // TODO: add timeout process
    Logger.info('userToTimeout', member);
  });
};
