/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `PromptFile` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/PromptFile
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
  Table,
  NotNull,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';
import ActionPromptFileHasAction from './Action_PromptFile_Has_Action.js';
import ActionPromptFileHasMimeType from './Action_PromptFile_Has_MimeType.js';
import MimeType from './MimeType.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface ActionPromptFile
  extends BelongsToManyMixin<MimeType, number, 'MimeType', 'MimeTypes'>,
    HasManyMixin<
      ActionPromptFileHasAction,
      number,
      'ActionPromptFileHasAction',
      'ActionPromptFileHasActions'
    > {}

/**
 *
 */
@Table({ tableName: 'Action_PromptFiles' })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class ActionPromptFile extends Model<
  InferAttributes<ActionPromptFile>,
  InferCreationAttributes<ActionPromptFile>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare errorMessage: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare pendingMessage: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare approvedMessage: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare rejectedMessage: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare actionId: number;

  @HasMany(() => ActionPromptFileHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'actionPromptFile',
    },
  })
  declare actions?: NonAttribute<ActionPromptFileHasAction>[];

  @BelongsToMany(() => MimeType, {
    through: {
      model: ActionPromptFileHasMimeType,
      unique: 'ActionPromptFileHasMimeType',
    },
    foreignKey: {
      name: 'actionPromptFileId',
    },
    otherKey: {
      name: 'mimeTypeId',
    },
  })
  declare MimeTypes?: NonAttribute<ActionPromptFileHasMimeType>[];
}

export default ActionPromptFile;
