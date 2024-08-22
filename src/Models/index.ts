/**
 * @file Sequelize connection manager.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @module Models/connection
 */

import { Sequelize } from '@sequelize/core';
import Logger from '$src/Logger';
import * as Models from './ModelLoader';

if (process.env.DB_NAME === undefined) throw new Error('DB_NAME is not set');
if (process.env.DB_USER === undefined) throw new Error('DB_USER is not set');
if (process.env.DB_PASS === undefined) throw new Error('DB_PASS is not set');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // @ts-expect-error "Models contains multiple sequelize models classes"
    models: Object.values(Models),

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

const loaderConnect = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Connecting to the database ...',
  'info',
);

await sequelize.authenticate().catch((error: unknown) => {
  Logger.error(true, 'Unable to connect to the database:', error);
});

loaderConnect.succeed();

const loaderSync = Logger.loader(
  { spinner: 'dots', color: 'cyan' },
  'Syncing models to tables ...',
  'info',
);

await sequelize.sync().catch((error: unknown) => {
  Logger.error(true, 'Unable to sync database:', error);
});
Logger.info('Database synced successfully.');
loaderSync.succeed();

export * from './ModelLoader';
