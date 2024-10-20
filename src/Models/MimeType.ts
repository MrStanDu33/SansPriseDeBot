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
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';
import { ActionPromptFileHasMimeType, ActionPromptFile } from '$src/Models';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-interface
interface MimeType
  extends BelongsToManyMixin<
    ActionPromptFile,
    number,
    'actionPromptFile',
    'actionPromptFiles'
  > {}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class MimeType extends Model<
  InferAttributes<MimeType>,
  InferCreationAttributes<MimeType>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

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

  @BelongsToMany(() => ActionPromptFile, {
    through: {
      model: ActionPromptFileHasMimeType,
      unique: 'ActionPromptFileHasMimeType',
    },
    foreignKey: {
      name: 'mimeTypeId',
    },
    otherKey: {
      name: 'actionPromptFileId',
    },
  })
  declare actionPromptFiles?: NonAttribute<ActionPromptFileHasMimeType>[];
}

export default MimeType;
