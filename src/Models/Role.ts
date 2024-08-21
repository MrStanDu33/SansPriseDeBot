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
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sequelize/core';

import {
  Attribute,
  NotNull,
  Unique,
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import ActionAddRole from './Action_AddRole.js';
import ActionRemoveRole from './Action_RemoveRole.js';
import RolesToAddToMember from './RolesToAddToMember.js';

/**
 *
 */
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Unique
  declare discordId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Unique
  declare name: string;

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
