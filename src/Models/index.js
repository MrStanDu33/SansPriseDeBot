/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { readdirSync } from 'fs';
import Logger from '$src/Logger';
import instance from './connection';

const db = {
  instance,
};

const modelImportPromises = [];

readdirSync('./src/Models/')
  .filter(
    (file) =>
      file.endsWith('.js') && !['index.js', 'connection.js'].includes(file),
  )
  .forEach((file) => {
    Logger.debug(`Importing model from ${file} ...`);
    const modelImportPromise = import(`./${file}`);

    modelImportPromise.then((modelBuilder) => {
      const model = modelBuilder.default(instance);
      db[model.name.replaceAll('_', '')] = model;
      Logger.debug(`Model ${model.name} successfully imported.`);
    });

    modelImportPromises.push(modelImportPromise);
  });

const loaderConnect = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Connecting to the database ...',
  'info',
);

await instance
  .authenticate()
  .catch((error) =>
    Logger.error(true, 'Unable to connect to the database:', error),
  );

loaderConnect.succeed();

await Promise.all(modelImportPromises);
const cascadeHooks = {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
};

db.FollowedMember.hasOne(db.LinkedChannel, cascadeHooks);
db.LinkedChannel.belongsTo(db.FollowedMember);

db.DecisionsTree.hasMany(db.Action, cascadeHooks);
db.Action.belongsTo(db.DecisionsTree);

db.Action.hasOne(db.ActionQuestion, {
  ...cascadeHooks,
  as: 'Question',
  foreignKey: 'ActionId',
});
db.ActionQuestion.belongsTo(db.Action);

db.ActionQuestion.hasMany(db.ActionQuestionAnswer, {
  ...cascadeHooks,
  as: 'Answers',
  foreignKey: 'ActionQuestionId',
});
db.ActionQuestionAnswer.belongsTo(db.ActionQuestion);

db.ActionQuestionAnswer.hasMany(db.Action, { constraints: false });
db.Action.belongsTo(db.ActionQuestionAnswer, { constraints: false });

db.Action.hasOne(db.ActionGoto, {
  ...cascadeHooks,
  as: 'Goto',
  foreignKey: 'ActionId',
});
db.ActionGoto.belongsTo(db.Action);

db.Action.hasOne(db.ActionGoto);
db.ActionGoto.belongsTo(db.Action, {
  foreignKey: 'TargetActionId',
  ...cascadeHooks,
});

db.Action.hasOne(db.ActionPrintMessage, {
  ...cascadeHooks,
  as: 'PrintMessage',
  foreignKey: 'ActionId',
});
db.ActionPrintMessage.belongsTo(db.Action);

db.Action.hasOne(db.ActionAddRole, {
  ...cascadeHooks,
  as: 'AddRole',
  foreignKey: 'ActionId',
});
db.ActionAddRole.belongsTo(db.Action);

db.Role.hasOne(db.ActionAddRole, cascadeHooks);
db.ActionAddRole.belongsTo(db.Role);

db.Action.hasOne(db.FollowedMember);
db.FollowedMember.belongsTo(db.Action, {
  foreignKey: 'CurrentActionId',
  ...cascadeHooks,
});

db.FollowedMember.hasMany(db.RolesToAddToMember);
db.RolesToAddToMember.belongsTo(db.FollowedMember);

db.Role.hasMany(db.RolesToAddToMember);
db.RolesToAddToMember.belongsTo(db.Role);

const loaderSync = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Syncing models to tables ...',
  'info',
);

await instance
  .sync()
  .catch((error) => Logger.error(true, 'Unable to sync database:', error));
Logger.info('Database synced successfully.');

loaderSync.succeed();

export default db;