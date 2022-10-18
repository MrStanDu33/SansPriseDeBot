/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

export default (instance) =>
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
    lastUpdateAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

/* {
  "rolesToAdd": [
    {
      "name": "[DW] Développeur Web",
      "roleId": "654691713893531669"
    }
  ]
} */
