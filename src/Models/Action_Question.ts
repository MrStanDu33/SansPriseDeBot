/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for `Question` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Question
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
  HasMany,
  NotNull,
  Table,
} from '@sequelize/core/decorators-legacy';

import { ActionQuestionAnswer } from '$src/Models';

/**
 *
 */
@Table({ tableName: 'Action_Questions' })
class ActionQuestion extends Model<
  InferAttributes<ActionQuestion>,
  InferCreationAttributes<ActionQuestion>
> {
  @Attribute(DataTypes.TEXT('long'))
  @NotNull
  declare question: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare uuid: string;

  @Attribute(DataTypes.INTEGER)
  declare actionId: number;

  @HasMany(() => ActionQuestionAnswer, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionQuestionId',
    },
    inverse: {
      as: 'answers',
    },
  })
  declare answers?: NonAttribute<ActionQuestionAnswer>[];
}

export default ActionQuestion;
