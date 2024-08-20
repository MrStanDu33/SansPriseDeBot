/**
 * @file Sequelize model for linking PromptFile action to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionPromptFileHasAction
 */
type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description ActionPromptFileHasAction model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated PromptFile action <-> Action relation model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionPromptFileHasActionModel = ActionPromptFileHasActionModelBuilder(instance);
 */
const ActionPromptFileHasActionModelBuilder = (
  instance: Sequelize,
): ModelStatic =>
  instance.define(
    'ActionPromptFileHasAction',
    {},
    {
      tableName: 'Action_PromptFiles_Has_Actions',
    },
  );

export default ActionPromptFileHasActionModelBuilder;
