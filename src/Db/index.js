/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { readdirSync } from 'fs';
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

const DecisionsTrees = {};
readdirSync('./src/Db/DecisionsTrees')
  .filter((file) => file.endsWith('.json') && !file.endsWith('.schema.json'))
  .forEach((file) => {
    const DecisionTreeDB = new JsonDB(
      new Config(`./src/Db/DecisionsTrees/${file}`, true, true, '/'),
    );
    DecisionTreeDB.getRef = (actionKey) => {
      if (typeof actionKey !== 'string') {
        throw new Error('Please provide a valid action key');
      }

      if (actionKey.split('')[0] === '#') {
        // eslint-disable-next-line no-param-reassign
        actionKey = actionKey.substring(1);
      }

      DecisionTreeDB.reload();

      const action = DecisionTreeDB.getData(actionKey);
      if (Object.hasOwnProperty.call(action, '$ref')) {
        return DecisionTreeDB.getRef(action.$ref);
      }
      return action;
    };
    DecisionsTrees[file.split('.')[0]] = DecisionTreeDB;
  });

export default { logs, DecisionsTrees };
export { logs, DecisionsTrees };
