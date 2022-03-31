import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const logs = new JsonDB(
  new Config('./src/Db/JsonStorage.json', true, true, '/'),
);

logs.getFollowedMember = (memberId) => {
  if (typeof memberId !== 'string') {
    throw new Error('Please provide a valid memberId');
  }

  logs.reload();

  const memberIndex = logs.getIndex('/app/followingMembers', memberId);

  if (memberIndex === -1) return null;

  return logs.getData(`/app/followingMembers[${memberIndex}]`);
};

const formationRolesDecisionsTree = new JsonDB(
  new Config('./src/Db/FormationRolesDecisionsTree.json', true, true, '/'),
);

formationRolesDecisionsTree.getRef = (actionKey) => {
  if (typeof actionKey !== 'string') {
    throw new Error('Please provide a valid action key');
  }

  if (actionKey.split('')[0] === '#') {
    // eslint-disable-next-line no-param-reassign
    actionKey = actionKey.substring(1);
  }

  formationRolesDecisionsTree.reload();

  const action = formationRolesDecisionsTree.getData(actionKey);
  if (Object.hasOwnProperty.call(action, '$ref')) {
    return formationRolesDecisionsTree.getRef(action.$ref);
  }
  return action;
};

export default { logs, formationRolesDecisionsTree };
export { logs, formationRolesDecisionsTree };
