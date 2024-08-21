/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for linking PromptFile action to a list of actions to run.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/ActionPromptFileHasMimeType
 */

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import { Table } from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_PromptFiles_Has_MimeTypes' })
class ActionPromptFileHasMimeType extends Model<
  InferAttributes<ActionPromptFileHasMimeType>,
  InferCreationAttributes<ActionPromptFileHasMimeType>
> {}

export default ActionPromptFileHasMimeType;
