/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for channels linked to a member.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/LinkedChannel
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
class LinkedChannel extends Model<
  InferAttributes<LinkedChannel>,
  InferCreationAttributes<LinkedChannel>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare discordId: string;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare name: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare followedMemberId: number;
}

export default LinkedChannel;
