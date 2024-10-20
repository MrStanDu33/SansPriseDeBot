/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for awaiting members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/AwaitingMember
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
  NotNull,
  Unique,
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';

/**
 *
 */
class AwaitingMember extends Model<
  InferAttributes<AwaitingMember>,
  InferCreationAttributes<AwaitingMember>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare memberId: string;

  @Attribute(DataTypes.STRING(4096))
  @NotNull
  declare existingRoles: string;

  @Attribute(DataTypes.STRING(2))
  @NotNull
  declare locale: string;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare username: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare priority: number;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;
}

export default AwaitingMember;
