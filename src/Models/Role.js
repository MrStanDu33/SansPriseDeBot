/**
 * @file Sequelize model for discord servers roles.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description Roles model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated role model.
 */
export default (instance) =>
  instance.define('Role', {
    discordId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
