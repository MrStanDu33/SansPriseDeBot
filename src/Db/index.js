import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const logs = new JsonDB(
  new Config('./src/Db/JsonStorage.json', true, true, '/'),
);
const formationRolesDecisionsTree = new JsonDB(
  new Config('./src/Db/FormationRolesDecisionsTree.json', true, true, '/'),
);

export default { logs, formationRolesDecisionsTree };
export { logs, formationRolesDecisionsTree };
