/**
 * @file Sequelize model for discord servers roles to add to followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/RolesToAddToMember
 */

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description RolesToAddToMembers model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated FollowedMember <-> Roles relation model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const RolesToAddToMemberModel = RolesToAddToMembersModelBuilder(instance);
 */
const RolesToAddToMembersModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('RolesToAddToMember', {});

export default RolesToAddToMembersModelBuilder;
