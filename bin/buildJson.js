import JsonRefs from 'json-refs';
import Logger from '$src/Logger';
import { rolesTree } from '$src/Db';

const boot = async () => {
  const loader = Logger.loader(
    { spinner: 'aesthetic', color: 'cyan' },
    'Compiling rolesTree.raw.json refs into rolesTree.json ...',
    'info',
  );

  const rawData = await JsonRefs.resolveRefsAt('./src/Db/rolesTree.raw.json');
  delete rawData.resolved.definitions;
  const data = rawData.resolved;

  rolesTree.push('/', data);

  loader.succeed();
  Logger.info('Compilation done !');
};

boot();
