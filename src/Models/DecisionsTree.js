/**
 * @file Sequelize model for decisions trees.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description Decision trees model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated decision tree model.
 */
export default (instance) =>
  instance.define('DecisionsTree', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  });
