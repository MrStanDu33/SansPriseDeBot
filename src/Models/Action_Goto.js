/**
 * @file Sequelize model for `Goto` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/** @typedef {import('@sequelize/core').Sequelize} Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description Goto actions model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated goto action model.
 */
export default (instance) => instance.define('Action_Goto', {});
