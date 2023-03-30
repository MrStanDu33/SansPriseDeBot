/**
 * @file Sequelize model for `Question` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Question
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description PrintMessage actions model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated question action answers model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionQuestionsModel = ActionQuestionsModelBuilder(instance);
 */
const ActionQuestionsModelBuilder = (instance) =>
  instance.define('Action_Question', {
    question: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    uuid: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
  });

export default ActionQuestionsModelBuilder;
