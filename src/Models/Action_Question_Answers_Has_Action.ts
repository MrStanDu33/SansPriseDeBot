/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for linking question's answers to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionQuestionAnswersHasAction
 */

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import { Table } from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_Question_Answers_Has_Actions' })
class ActionQuestionAnswersHasActions extends Model<
  InferAttributes<ActionQuestionAnswersHasActions>,
  InferCreationAttributes<ActionQuestionAnswersHasActions>
> {}

export default ActionQuestionAnswersHasActions;
