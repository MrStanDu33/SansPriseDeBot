/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for linking PromptFile action to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionPromptFileHasMimeType
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
  Table,
  NotNull,
  PrimaryKey,
  AutoIncrement,
} from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_PromptFiles_Has_MimeTypes' })
class ActionPromptFileHasMimeType extends Model<
  InferAttributes<ActionPromptFileHasMimeType>,
  InferCreationAttributes<ActionPromptFileHasMimeType>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionPromptFileId: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare mimeTypeId: number;
}

export default ActionPromptFileHasMimeType;
