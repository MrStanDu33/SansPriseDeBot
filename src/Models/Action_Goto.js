/**
 * @file Sequelize model for `Goto` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Goto
 */

/** @typedef {import('@sequelize/core').Sequelize} Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description Goto actions model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated goto action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionGotosModel = ActionGotosModelBuilder(instance);
 */
const ActionGotosModelBuilder = (instance) =>
  instance.define('Action_Goto', {});

export default ActionGotosModelBuilder;
