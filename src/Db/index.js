import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const logs = new JsonDB(
  new Config('./src/Db/JsonStorage.json', true, true, '/'),
);
const rolesTree = new JsonDB(
  new Config('./src/Db/rolesTree.json', true, true, '/'),
);

export default { logs, rolesTree };
export { logs, rolesTree };
