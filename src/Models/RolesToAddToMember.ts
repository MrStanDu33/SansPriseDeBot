/* eslint-disable no-use-before-define */
/**
 * @file Sequelize model for discord servers roles to add to followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/RolesToAddToMember
 */

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';

/**
 *
 */
class RolesToAddToMember extends Model<
  InferAttributes<RolesToAddToMember>,
  InferCreationAttributes<RolesToAddToMember>
> {}

export default RolesToAddToMember;
