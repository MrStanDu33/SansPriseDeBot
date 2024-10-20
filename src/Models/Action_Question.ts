/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `Question` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Question
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
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';
import { ActionQuestionAnswer } from '$src/Models';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-interface
interface ActionQuestion
  extends HasManyMixin<ActionQuestionAnswer, number, 'answer', 'answers'> {}

/**
 *
 */
@Table({ tableName: 'Action_Questions' })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class ActionQuestion extends Model<
  InferAttributes<ActionQuestion>,
  InferCreationAttributes<ActionQuestion>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT('long'))
  @NotNull
  declare question: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare uuid: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
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
