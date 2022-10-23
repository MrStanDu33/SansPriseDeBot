/**
 * @file Sequelize model for awaiting members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelCtor<Model> } ModelConstructor */

/**
 * @category Models
 *
 * @description AwaitingMembers model initializer.
 *
 * @param   { Sequelize }        instance - Sequelize instance linked to database.
 *
 * @returns { ModelConstructor }          - Instantiated awaiting member model.
 */
export default (instance) =>
  instance.define('AwaitingMember', {
    memberId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    existingRoles: {
      type: DataTypes.STRING(4096),
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
