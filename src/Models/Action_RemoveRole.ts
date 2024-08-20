/**
 * @file Sequelize model for `RemoveRole` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/RemoveRole
 */

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description RemoveRole actions model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated removeRole action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionRemoveRolesModel = ActionRemoveRolesModelBuilder(instance);
 */
const ActionRemoveRolesModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('Action_RemoveRole', {});

export default ActionRemoveRolesModelBuilder;
