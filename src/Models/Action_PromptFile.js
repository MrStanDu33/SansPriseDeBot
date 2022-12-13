/**
 * @file Sequelize model for `PromptFile` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/PromptFile
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description PromptFile actions model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated promptFile action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionPromptFileModel = ActionPromptFileModelBuilder(instance);
 */
const ActionPromptFileModelBuilder = (instance) =>
  instance.define('Action_PromptFile', {
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pendingMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    approvedMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rejectedMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

export default ActionPromptFileModelBuilder;
