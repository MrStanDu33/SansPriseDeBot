/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { DataTypes } from '@sequelize/core';

export default (instance) =>
  instance.define('Action_PrintMessage', {
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });
