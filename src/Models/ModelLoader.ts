/**
 * @file Sequelize models manager and relation configurator.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models
 */

import { readdirSync } from 'fs';
import Logger from '$src/Logger';
import { ModelStatic } from '@sequelize/core';

type DB = Record<string, ModelStatic>;

const db: DB = {};

const modelImportPromises: Promise<ModelStatic>[] = [];

readdirSync(import.meta.dirname)
  .filter(
    (file) =>
      file.endsWith('.js') && !['index.js', 'ModelLoader.js'].includes(file),
  )
  .forEach((file) => {
    Logger.debug(`Importing model from ${file} ...`);
    const modelImportPromise = import(`./${file}`) as Promise<ModelStatic>;

    modelImportPromise
      .then((importedModules) => {
        const model: ModelStatic = importedModules.default;
        const modelName = model.name.replaceAll('_', '');
        db[modelName] = model;
        Logger.debug(`Model ${model.name} successfully imported.`);
      })
      .catch((err: unknown) => {
        Logger.error(err);
      });

    modelImportPromises.push(modelImportPromise);
  });

await Promise.all(modelImportPromises);

export default db;
