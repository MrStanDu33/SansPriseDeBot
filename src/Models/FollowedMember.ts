/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/FollowedMember
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
  Unique,
  Default,
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import LinkedChannel from './LinkedChannel.js';
import RolesToAddToMember from './RolesToAddToMember.js';

/**
 *
 */
class FollowedMember extends Model<
  InferAttributes<FollowedMember>,
  InferCreationAttributes<FollowedMember>
> {
  @Attribute(DataTypes.STRING(20))
  @NotNull
  declare guildId: string;

  @Attribute(DataTypes.STRING(2))
  @NotNull
  declare locale: string;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare memberId: string;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare username: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare inProcess: boolean;

  @Attribute(DataTypes.BOOLEAN)
  declare needUploadFile: boolean;

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(DataTypes.NOW)
  declare lastUpdateAt: Date;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isNewComer: boolean;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare warnsForInactivity: number;

  @HasOne(() => LinkedChannel, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare linkedChannel?: NonAttribute<LinkedChannel>;

  @HasMany(() => RolesToAddToMember, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare rolesToAddToMember?: NonAttribute<RolesToAddToMember>;
}

export default FollowedMember;
