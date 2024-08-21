/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file Sequelize model for actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action
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
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import ActionQuestion from './Action_Question.js';
import ActionQuestionAnswersHasAction from './Action_Question_Answer_Has_Action.js';
import ActionGoto from './Action_Goto.js';
import ActionAddRole from './Action_AddRole.js';
import ActionPrintMessages from './Action_PrintMessage.js';
import ActionRemoveRole from './Action_RemoveRole.js';
import ActionPromptFile from './Action_PromptFile.js';
import ActionPromptFileHasAction from './Action_PromptFile_Has_Action.js';
import FollowedMember from './FollowedMember.js';

/**
 *
 */
@Table({ tableName: 'Action' })
class Action extends Model<
  InferAttributes<Action>,
  InferCreationAttributes<Action>
> {
  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare type: string;

  @HasOne(() => ActionQuestion, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'ActionId',
    },
    inverse: {
      as: 'Question',
    },
  })
  declare actionQuestion?: NonAttribute<ActionQuestion>;

  @HasMany(() => ActionQuestionAnswersHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare actionQuestionAnswersHasAction?: NonAttribute<ActionQuestionAnswersHasAction>;

  @HasOne(() => ActionGoto, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'ActionId',
    },
    inverse: {
      as: 'Goto',
    },
  })
  declare actionGoto?: NonAttribute<ActionGoto>;

  @HasOne(() => ActionGoto, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'TargetAction',
    },
  })
  declare targetAction?: NonAttribute<ActionGoto>;

  @HasOne(() => ActionPrintMessages, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'ActionId',
    },
    inverse: {
      as: 'PrintMessage',
    },
  })
  declare printMessage?: NonAttribute<ActionPrintMessages>;

  @HasOne(() => ActionAddRole, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  })
  declare addRole?: NonAttribute<ActionAddRole>;

  @HasOne(() => ActionRemoveRole, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'Action',
    },
  })
  declare removeRole?: NonAttribute<ActionRemoveRole>;

  @HasOne(() => ActionPromptFile, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'Action',
    },
  })
  declare promptFile?: NonAttribute<ActionPromptFile>;

  @HasMany(() => ActionPromptFileHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'Action',
    },
  })
  declare ActionPromptFile?: NonAttribute<ActionPromptFileHasAction>;

  @HasOne(() => FollowedMember, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    inverse: {
      as: 'CurrentAction',
    },
  })
  declare followedMember?: NonAttribute<FollowedMember>;
}
export default Action;
