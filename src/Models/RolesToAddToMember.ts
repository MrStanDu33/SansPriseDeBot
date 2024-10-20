/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for discord servers roles to add to followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/RolesToAddToMember
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
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';

/**
 *
 */
class RolesToAddToMember extends Model<
  InferAttributes<RolesToAddToMember>,
  InferCreationAttributes<RolesToAddToMember>
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
  declare followedMemberId: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare roleId: number;
}

export default RolesToAddToMember;
