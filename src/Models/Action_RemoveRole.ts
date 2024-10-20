/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `RemoveRole` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/RemoveRole
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
@Table({ tableName: 'Action_RemoveRoles' })
class ActionRemoveRole extends Model<
  InferAttributes<ActionRemoveRole>,
  InferCreationAttributes<ActionRemoveRole>
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
  declare actionId: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare roleId: number;
}

export default ActionRemoveRole;
