/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `Goto` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/Goto
 */

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import { Table, Attribute } from '@sequelize/core/decorators-legacy';

/**
 *
 */
@Table({ tableName: 'Action_Gotos' })
class ActionGoto extends Model<
  InferAttributes<ActionGoto>,
  InferCreationAttributes<ActionGoto>
> {}

export default ActionGoto;
