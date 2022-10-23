/**
 * @file Sequelize model for channels linked to a member.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description LinkedChannels model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated linked channel model.
 */
export default (instance) =>
  instance.define('LinkedChannel', {
    discordId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  });
