/**
 * @file Sequelize model for actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description Action model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionsModel = ActionsModelBuilder(instance);
 */
const ActionsModelBuilder = (instance: Sequelize): ModelStatic =>
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
