/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for `Question` actions answers.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Question/Answer
 */

import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  Table,
  NotNull,
  AllowNull,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';

import ActionQuestionAnswersHasAction from './Action_Question_Answers_Has_Action.js';

/**
 *
 */
@Table({ tableName: 'Action_Question_Answers' })
class ActionQuestionAnswer extends Model<
  InferAttributes<ActionQuestionAnswer>,
  InferCreationAttributes<ActionQuestionAnswer>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  @AllowNull
  declare icon: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare text: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionQuestionId: number;

  @HasMany(() => ActionQuestionAnswersHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'actionQuestionAnswer',
    },
  })
  declare answerActions?: NonAttribute<ActionQuestionAnswersHasAction>;
}

export default ActionQuestionAnswer;
