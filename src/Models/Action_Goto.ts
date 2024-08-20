/**
 * @file Sequelize model for `Goto` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Goto
 */
type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description Goto actions model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated goto action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionGotosModel = ActionGotosModelBuilder(instance);
 */
const ActionGotosModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('Action_Goto', {});

export default ActionGotosModelBuilder;
