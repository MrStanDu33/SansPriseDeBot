/**
 * @file Sequelize model for `Question` actions answers.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description Question action answers model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated question action answers model.
 */
export default (instance) =>
  instance.define('Action_Question_Answer', {
    icon: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
