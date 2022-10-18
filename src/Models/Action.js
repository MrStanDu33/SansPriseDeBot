/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

export default (instance) =>
  instance.define('Action', {
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
