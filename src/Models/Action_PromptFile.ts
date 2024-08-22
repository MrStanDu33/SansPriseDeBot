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
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Table,
  HasMany,
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';
import ActionPromptFileHasAction from './Action_PromptFile_Has_Action.js';
import ActionPromptFileHasMimeType from './Action_PromptFile_Has_MimeType.js';
import MimeType from './MimeType.js';

/**
 *
 */
@Table({ tableName: 'Action_PromptFiles' })
class ActionPromptFile extends Model<
  InferAttributes<ActionPromptFile>,
  InferCreationAttributes<ActionPromptFile>
> {
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
    /**
     *
     */
    through: () => ActionPromptFileHasMimeType,
  })
  declare MimeTypes?: NonAttribute<ActionPromptFileHasMimeType>[];
}

export default ActionPromptFile;
