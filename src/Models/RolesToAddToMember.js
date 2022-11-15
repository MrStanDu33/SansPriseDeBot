/**
 * @file Sequelize model for discord servers roles to add to followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/RolesToAddToMember
 */

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description RolesToAddToMembers model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated FollowedMember <-> Roles relation model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const RolesToAddToMemberModel = RolesToAddToMembersModelBuilder(instance);
 */
const RolesToAddToMembersModelBuilder = (instance) =>
  instance.define('RolesToAddToMember', {});

export default RolesToAddToMembersModelBuilder;
