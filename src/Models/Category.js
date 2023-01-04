/**
 * @file Sequelize model for Discord channels categories.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/Category
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @description Categories model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated linked channel model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const CategoriesModel = CategoriesModelBuilder(instance);
 */
const CategoriesModelBuilder = (instance) =>
  instance.define(
    'Category',
    {
      discordId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    { tableName: 'Categories' },
  );

export default CategoriesModelBuilder;
