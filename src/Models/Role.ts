/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for discord servers roles.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Role
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
  NotNull,
  Unique,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  HasOne,
} from '@sequelize/core/decorators-legacy';
import ActionAddRole from './Action_AddRole.js';
import ActionRemoveRole from './Action_RemoveRole.js';
import RolesToAddToMember from './RolesToAddToMember.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Role
  extends HasOneMixin<ActionAddRole, number, 'actionAddRole'>,
    HasOneMixin<ActionRemoveRole, number, 'actionRemoveRole'>,
    HasManyMixin<
      RolesToAddToMember,
      number,
      'rolesToAddToMember',
      'rolesToAddToMembers'
    > {}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare discordId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Unique
  declare name: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @HasOne(() => ActionAddRole, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare actionAddRole?: NonAttribute<ActionAddRole>;

  @HasOne(() => ActionRemoveRole, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare actionRemoveRole?: NonAttribute<ActionRemoveRole>;

  @HasMany(() => RolesToAddToMember, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare rolesToAddToMember?: NonAttribute<RolesToAddToMember>;
}

export default Role;
