import { logs } from '$src/Db';

export default () => {
  const rawAwaitingMembers = logs.getData('/app/awaitingMembers');

  const unsortedAwaitingMembers = rawAwaitingMembers.map((member) => {
    if (member.roles.includes('849789583221981185')) {
      return { ...member, userActivityNumber: 50 };
    }
    if (member.roles.includes('849789508349722664')) {
      return { ...member, userActivityNumber: 25 };
    }
    if (member.roles.includes('849789452162301982')) {
      return { ...member, userActivityNumber: 10 };
    }
    if (member.roles.includes('849789381220892693')) {
      return { ...member, userActivityNumber: 5 };
    }
    if (member.roles.includes('849789213167058985')) {
      return { ...member, userActivityNumber: 1 };
    }
    return { ...member, userActivityNumber: 0 };
  });

  const sortedAwaitingMembers = unsortedAwaitingMembers.sort(
    (a, b) => b.userActivityNumber - a.userActivityNumber,
  );

  logs.push('/app/awaitingMembers', sortedAwaitingMembers, true);
};
