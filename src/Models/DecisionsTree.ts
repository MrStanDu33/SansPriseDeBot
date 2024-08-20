/**
 * @file Sequelize model for decisions trees.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/DecisionsTree
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description Decision trees model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated decision tree model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const DecisionsTreesModel = DecisionsTreesModelBuilder(instance);
 */
const DecisionsTreesModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('DecisionsTree', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  });

export default DecisionsTreesModelBuilder;
