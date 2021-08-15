import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const logDb = new JsonDB(new Config('JsonStorage.json', true, true, '/'));
const actionsDb = new JsonDB(new Config('rolesTree.json', true, true, '/'));

export { logDb, actionsDb };
