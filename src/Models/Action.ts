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
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import ActionQuestion from './Action_Question.js';
import ActionQuestionAnswersHasAction from './Action_Question_Answers_Has_Action.js';
import ActionGoto from './Action_Goto.js';
import ActionAddRole from './Action_AddRole.js';
import ActionPrintMessages from './Action_PrintMessage.js';
import ActionRemoveRole from './Action_RemoveRole.js';
import ActionPromptFile from './Action_PromptFile.js';
import ActionPromptFileHasAction from './Action_PromptFile_Has_Action.js';
import FollowedMember from './FollowedMember.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Action
  extends HasOneMixin<ActionQuestion, number, 'question'>,
    HasManyMixin<
      ActionQuestionAnswersHasAction,
      number,
      'actionQuestionAnswersHasAction',
      'actionQuestionAnswersHasActions'
    >,
    HasOneMixin<ActionGoto, number, 'goto'>,
    HasOneMixin<ActionGoto, number, 'targetAction'>,
    HasOneMixin<ActionPrintMessages, number, 'printMessage'>,
    HasOneMixin<ActionAddRole, number, 'addRole'>,
    HasOneMixin<ActionRemoveRole, number, 'removeRole'>,
    HasOneMixin<ActionPromptFile, number, 'promptFile'>,
    HasManyMixin<
      ActionPromptFileHasAction,
      number,
      'ActionPromptFile',
      'ActionPromptFiles'
    >,
    HasOneMixin<FollowedMember, number, 'followedMember'> {}

/**
 *
 */
@Table({ tableName: 'Action' })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Action extends Model<
  InferAttributes<Action>,
  InferCreationAttributes<Action>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare type: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare updatedAt: CreationOptional<Date>;

  @HasOne(() => ActionQuestion, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
    inverse: {
      as: 'actionQuestion',
    },
  })
  declare question?: NonAttribute<ActionQuestion>;

  @HasMany(() => ActionQuestionAnswersHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
  })
  declare actionQuestionAnswersHasAction?: NonAttribute<ActionQuestionAnswersHasAction>;

  @HasOne(() => ActionGoto, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
    inverse: {
      as: 'goto',
    },
  })
  declare goto?: NonAttribute<ActionGoto>;

  @HasOne(() => ActionGoto, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'targetActionId',
    },
    inverse: {
      as: 'targetAction',
    },
  })
  declare targetAction?: NonAttribute<ActionGoto>;

  @HasOne(() => ActionPrintMessages, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
    inverse: {
      as: 'printMessage',
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
      name: 'actionId',
    },
    inverse: {
      as: 'action',
    },
  })
  declare removeRole?: NonAttribute<ActionRemoveRole>;

  @HasOne(() => ActionPromptFile, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
    inverse: {
      as: 'action',
    },
  })
  declare promptFile?: NonAttribute<ActionPromptFile>;

  @HasMany(() => ActionPromptFileHasAction, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'actionId',
    },
    inverse: {
      as: 'action',
    },
  })
  declare ActionPromptFile?: NonAttribute<ActionPromptFileHasAction>;

  @HasOne(() => FollowedMember, {
    foreignKey: {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'currentActionId',
    },
    inverse: {
      as: 'currentAction',
    },
  })
  declare followedMember?: NonAttribute<FollowedMember>;
}
export default Action;
