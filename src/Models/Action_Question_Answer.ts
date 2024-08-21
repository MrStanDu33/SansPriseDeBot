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
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Table,
  HasMany,
  AllowNull,
} from '@sequelize/core/decorators-legacy';

import ActionQuestionAnswersHasAction from './Action_Question_Answer_Has_Action.js';

/**
 *
 */
@Table({ tableName: 'Action_Question_Answers' })
class ActionQuestionAnswer extends Model<
  InferAttributes<ActionQuestionAnswer>,
  InferCreationAttributes<ActionQuestionAnswer>
> {
  @Attribute(DataTypes.TEXT)
  @AllowNull
  declare icon: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare text: string;

  @Attribute(DataTypes.INTEGER)
  declare ActionQuestionId: number;

  @HasMany(() => ActionQuestionAnswersHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'ActionQuestionAnswer',
    },
  })
  declare actionQuestionAnswersHasAction?: NonAttribute<ActionQuestionAnswersHasAction>;
}

export default ActionQuestionAnswer;
