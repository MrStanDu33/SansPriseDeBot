/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for `RemoveRole` actions.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Action/RemoveRole
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
@Table({ tableName: 'Action_RemoveRoles' })
class ActionRemoveRole extends Model<
  InferAttributes<ActionRemoveRole>,
  InferCreationAttributes<ActionRemoveRole>
> {}

export default ActionRemoveRole;
