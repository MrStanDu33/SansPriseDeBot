/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `PrintMessage` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/PrintMessage
 */

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import { Attribute, NotNull, Table } from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_PrintMessages' })
class ActionPrintMessages extends Model<
  InferAttributes<ActionPrintMessages>,
  InferCreationAttributes<ActionPrintMessages>
> {
  @Attribute(DataTypes.TEXT('long'))
  @NotNull
  declare message: string;

  @Attribute(DataTypes.INTEGER)
  declare ActionId: number;
}

export default ActionPrintMessages;
