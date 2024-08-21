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
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import { Attribute, NotNull, Unique } from '@sequelize/core/decorators-legacy';

/**
 *
 */
class LinkedChannel extends Model<
  InferAttributes<LinkedChannel>,
  InferCreationAttributes<LinkedChannel>
> {
  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare discordId: string;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare name: string;
}

export default LinkedChannel;
