/**
 * @file Sequelize model for MIME types.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/MimeType
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description MimeTypes model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated MIME types model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const MimeTypesModel = MimeTypesModelBuilder(instance);
 */
const MimeTypesModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('MimeType', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  });

export default MimeTypesModelBuilder;
