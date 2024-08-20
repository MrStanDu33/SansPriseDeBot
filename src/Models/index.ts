/**
 * @file Sequelize models manager and relation configurator.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models
 */

import { readdirSync } from 'fs';
import Logger from '$src/Logger';
import instance from './connection';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;
type ForeignKeyOptions = import('@sequelize/core').ForeignKeyOptions<string>;

interface ModelBuilder {
  default: (arg0: Sequelize) => ModelStatic;
}

type DB = Record<string, ModelStatic>;

const db: DB = {};

const modelImportPromises: Promise<ModelBuilder>[] = [];

readdirSync(import.meta.dirname)
  .filter(
    (file) =>
      file.endsWith('.js') && !['index.js', 'connection.js'].includes(file),
  )
  .forEach((file) => {
    Logger.debug(`Importing model from ${file} ...`);
    const modelImportPromise = import(`./${file}`) as Promise<ModelBuilder>;

    modelImportPromise
      .then((modelBuilder: ModelBuilder) => {
        const model: ModelStatic = modelBuilder.default(instance);
        db[model.name.replaceAll('_', '')] = model;
        Logger.debug(`Model ${model.name} successfully imported.`);
      })
      .catch((err: unknown) => {
        Logger.error(err);
      });

    modelImportPromises.push(modelImportPromise);
  });

const loaderConnect = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Connecting to the database ...',
  'info',
);

await instance.authenticate().catch((error: unknown) => {
  Logger.error(true, 'Unable to connect to the database:', error);
});

loaderConnect.succeed();
await Promise.all(modelImportPromises);

const cascadeHooks: ForeignKeyOptions = {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
};

db.FollowedMember.hasOne(db.LinkedChannel, {
  foreignKey: cascadeHooks,
});

db.DecisionsTree.hasMany(db.Action, { foreignKey: cascadeHooks });

db.Action.hasOne(db.ActionQuestion, {
  as: 'Question',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.ActionQuestion.hasMany(db.ActionQuestionAnswer, {
  as: 'Answers',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionQuestionId',
  },
});

db.ActionQuestionAnswer.hasMany(db.ActionQuestionAnswersHasAction, {
  foreignKey: cascadeHooks,
  as: 'AnswerActions',
});

db.Action.hasMany(db.ActionQuestionAnswersHasAction, {
  foreignKey: cascadeHooks,
  as: 'AnswerActions',
});

db.Action.hasOne(db.ActionGoto, {
  as: 'Goto',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.Action.hasOne(db.ActionGoto, {
  foreignKey: cascadeHooks,
  inverse: {
    as: 'TargetAction',
  },
});

db.Action.hasOne(db.ActionPrintMessage, {
  as: 'PrintMessage',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.Action.hasOne(db.ActionAddRole, {
  as: 'AddRole',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.Action.hasOne(db.ActionRemoveRole, {
  as: 'RemoveRole',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.Action.hasOne(db.ActionPromptFile, {
  as: 'PromptFile',
  foreignKey: {
    ...cascadeHooks,
    name: 'ActionId',
  },
});

db.ActionPromptFile.hasMany(db.ActionPromptFileHasAction, {
  foreignKey: cascadeHooks,
  as: 'Actions',
});

db.Action.hasMany(db.ActionPromptFileHasAction, {
  foreignKey: cascadeHooks,
  as: 'Actions',
});

db.ActionPromptFile.belongsToMany(db.MimeType, {
  as: 'MimeTypes',
  through: 'Action_PromptFiles_Has_MimeTypes',
});
db.MimeType.belongsToMany(db.ActionPromptFile, {
  through: 'Action_PromptFiles_Has_MimeTypes',
});

db.Role.hasOne(db.ActionAddRole, { foreignKey: cascadeHooks });

db.Role.hasOne(db.ActionRemoveRole, { foreignKey: cascadeHooks });

db.Action.hasOne(db.FollowedMember, {
  foreignKey: 'CurrentActionId',
});

db.FollowedMember.hasMany(db.RolesToAddToMember, {
  foreignKey: cascadeHooks,
});

db.Role.hasMany(db.RolesToAddToMember, { foreignKey: cascadeHooks });

const loaderSync = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Syncing models to tables ...',
  'info',
);

await instance.sync().catch((error: unknown) => {
  Logger.error(true, 'Unable to sync database:', error);
});
Logger.info('Database synced successfully.');

loaderSync.succeed();

export default db;
