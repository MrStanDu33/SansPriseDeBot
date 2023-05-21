/**
 * @file Sequelize model for actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description Action model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionsModel = ActionsModelBuilder(instance);
 */
const ActionsModelBuilder = (instance) =>
  instance.define(
    'Action',
    {
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'Action',
    },
  );

export default ActionsModelBuilder;
