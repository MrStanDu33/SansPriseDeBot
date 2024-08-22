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
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';

import { ActionPromptFileHasMimeType, ActionPromptFile } from '$src/Models';

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

  @BelongsToMany(() => ActionPromptFile, {
    /**
     *
     */
    through: () => ActionPromptFileHasMimeType,
  })
  declare actionPromptFile?: NonAttribute<ActionPromptFileHasMimeType>[];

  // @HasMany(() => ActionPromptFileHasMimeType, {
  //   foreignKey: {
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   },
  //   inverse: {
  //     as: 'MimeTypes',
  //   },
  // })
  // declare ActionPromptFiles?: NonAttribute<ActionPromptFileHasMimeType>[];
}

export default MimeType;
