/**
 * @file Sequelize model for followed members.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/FollowedMember
 */

import { DataTypes } from '@sequelize/core';

type Sequelize = import('@sequelize/core').Sequelize;
type ModelStatic = import('@sequelize/core').ModelStatic;

/**
 * @description FollowedMembers model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated followed member model.
 *
 * @example
 * const instance = new Sequelize('DB_NAME', 'DB_USER', 'DB_PASS', {
 *   host: 'DB_HOST',
 *   dialect: 'mysql',
 * });
 *
 * const FollowedMembersModel = FollowedMembersModelBuilder(instance);
 */
const FollowedMembersModelBuilder = (instance: Sequelize): ModelStatic =>
  instance.define('FollowedMember', {
    guildId: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    memberId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    inProcess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    needUploadFile: {
      type: DataTypes.BOOLEAN,
    },
    lastUpdateAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isNewComer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    warnsForInactivity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

export default FollowedMembersModelBuilder;
