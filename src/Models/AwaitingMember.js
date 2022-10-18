/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

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
