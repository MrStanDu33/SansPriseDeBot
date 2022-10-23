/**
 * @file Sequelize model for discord servers roles to add to followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models:RolesToAddToMember
 */

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description RolesToAddToMembers model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated FollowedMember <-> Roles relation model.
 */
export default (instance) => instance.define('RolesToAddToMember', {});
