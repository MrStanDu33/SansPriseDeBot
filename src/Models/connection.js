/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { Sequelize } from '@sequelize/core';
import Logger from '$src/Logger';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => {
      if (process.env.APP_DEBUG === 'true') Logger.debug(msg);
    },
  },
);

export default sequelize;
