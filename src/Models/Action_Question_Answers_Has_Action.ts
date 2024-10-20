/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for linking question's answers to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionQuestionAnswersHasAction
 */

import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  Table,
  NotNull,
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_Question_Answers_Has_Actions' })
class ActionQuestionAnswersHasActions extends Model<
  InferAttributes<ActionQuestionAnswersHasActions>,
  InferCreationAttributes<ActionQuestionAnswersHasActions>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionQuestionAnswerId: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionId: number;
}

export default ActionQuestionAnswersHasActions;
