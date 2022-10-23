/**
 * @file Sequelize model for actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description Action model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated action model.
 */
export default (instance) =>
  instance.define('Action', {
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
