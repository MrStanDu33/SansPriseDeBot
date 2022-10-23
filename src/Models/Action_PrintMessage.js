/**
 * @file Sequelize model for `PrintMessage` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description PrintMessage actions model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated printMessage action model.
 */
export default (instance) =>
  instance.define('Action_PrintMessage', {
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });
