/**
 * @file Sequelize model for linking PromptFile action to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionPromptFileHasAction
 */

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description ActionPromptFileHasAction model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated PromptFile action <-> Action relation model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionPromptFileHasActionModel = ActionPromptFileHasActionModelBuilder(instance);
 */
const ActionPromptFileHasActionModelBuilder = (instance) =>
  instance.define(
    'ActionPromptFileHasAction',
    {},
    {
      tableName: 'Action_PromptFiles_Has_Actions',
    },
  );

export default ActionPromptFileHasActionModelBuilder;
