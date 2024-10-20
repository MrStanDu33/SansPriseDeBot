/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `PrintMessage` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/PrintMessage
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
@Table({ tableName: 'Action_PrintMessages' })
class ActionPrintMessages extends Model<
  InferAttributes<ActionPrintMessages>,
  InferCreationAttributes<ActionPrintMessages>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT('long'))
  @NotNull
  declare message: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionId: number;
}

export default ActionPrintMessages;
