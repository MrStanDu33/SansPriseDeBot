/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for decisions trees.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/DecisionsTree
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
  HasMany,
} from '@sequelize/core/decorators-legacy';
import Action from './Action.js';

/**
 *
 */
class DecisionsTree extends Model<
  InferAttributes<DecisionsTree>,
  InferCreationAttributes<DecisionsTree>
> {
  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare name: string;

  @HasMany(() => Action, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare action?: NonAttribute<Action>;
}

export default DecisionsTree;
