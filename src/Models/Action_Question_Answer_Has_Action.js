/**
 * @file Sequelize model for linking question's answers to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionQuestionAnswersHasAction
 */

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description ActionQuestionAnswersHasAction model initializer.
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
 * const ActionQuestionAnswersHasActionModel = ActionQuestionAnswersHasActionModelBuilder(instance);
 */
const ActionQuestionAnswersHasActionModelBuilder = (instance) =>
  instance.define(
    'ActionQuestionAnswersHasAction',
    {},
    {
      tableName: 'Action_Question_Answers_Has_Actions',
    },
  );

export default ActionQuestionAnswersHasActionModelBuilder;
