/**
 * @file Sequelize model for `Question` actions answers.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Question/Answer
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description Question action answers model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated question action answers model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const ActionQuestionAnswersModel = ActionQuestionAnswersModelBuilder(instance);
 */
const ActionQuestionAnswersModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('Action_Question_Answer', {
    icon: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

export default ActionQuestionAnswersModelBuilder;
