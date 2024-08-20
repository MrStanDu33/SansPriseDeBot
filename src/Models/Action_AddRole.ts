/**
 * @file Sequelize model for `AddRole` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/AddRole
 */
type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description AddRole actions model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated addRole action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionAddRolesModel = ActionAddRolesModelBuilder(instance);
 */
const ActionAddRolesModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('Action_AddRole', {});

export default ActionAddRolesModelBuilder;
