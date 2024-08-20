/**
 * @file Sequelize model for `PrintMessage` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/PrintMessage
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;
/**
 * @description PrintMessage actions model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated printMessage action model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionPrintMessagesModel = ActionPrintMessagesModelBuilder(instance);
 */
const ActionPrintMessagesModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('Action_PrintMessage', {
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });

export default ActionPrintMessagesModelBuilder;
