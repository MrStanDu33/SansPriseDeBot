/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `AddRole` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/AddRole
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
@Table({ tableName: 'Action_AddRoles' })
class ActionAddRole extends Model<
  InferAttributes<ActionAddRole>,
  InferCreationAttributes<ActionAddRole>
> {}

export default ActionAddRole;
