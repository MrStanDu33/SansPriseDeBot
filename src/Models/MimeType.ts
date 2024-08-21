/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for MIME types.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/MimeType
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
import ActionPromptFileHasMimeType from './Action_PromptFile_Has_MimeType.js';

/**
 *
 */
class MimeType extends Model<
  InferAttributes<MimeType>,
  InferCreationAttributes<MimeType>
> {
  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare name: string;

  @HasMany(() => ActionPromptFileHasMimeType, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'MimeType',
    },
  })
  declare ActionPromptFiles?: NonAttribute<ActionPromptFileHasMimeType>[];
}

export default MimeType;
