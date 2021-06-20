import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const db = new JsonDB(new Config('JsonStorage.json', true, true, '/'));
export default db;
