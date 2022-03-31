import { logs } from '$src/Db';

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
    console.log('userToTimeout', member);
  });
};
