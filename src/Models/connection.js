/**
 * @file Sequelize connection manager.
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
    /**
     * @description Function that is called every time a query is executed to log queries
     *              if APP_DEBUG is set to true.
     *
     * @param { string } msg - Sequelize query to log.
     */
    logging: (msg) => {
      if (process.env.APP_DEBUG === 'true') Logger.debug(msg);
    },
  },
);

export default sequelize;
