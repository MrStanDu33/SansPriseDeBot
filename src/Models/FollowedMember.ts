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
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Unique,
  Default,
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import LinkedChannel from './LinkedChannel.js';
import RolesToAddToMember from './RolesToAddToMember.js';
import type Action from './Action.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface FollowedMember
  extends BelongsToMixin<Action, number, 'Action'>,
    HasOneMixin<LinkedChannel, number, 'LinkedChannel'>,
    HasManyMixin<
      RolesToAddToMember,
      number,
      'RolesToAddToMember',
      'RolesToAddToMembers'
    > {}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class FollowedMember extends Model<
  InferAttributes<FollowedMember>,
  InferCreationAttributes<FollowedMember>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

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

  @Attribute(DataTypes.INTEGER)
  declare currentActionId: number;
}

export default FollowedMember;
