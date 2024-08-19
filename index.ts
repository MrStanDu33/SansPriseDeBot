/**
 * @file App startup file.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import sourceMapSupport from 'source-map-support';
import '$src/config';
import App from '$src/Classes/App';
import Logger from '$src/Logger';
import Store from '$src/Store';

sourceMapSupport.install();

Error.stackTraceLimit = Infinity;

// eslint-disable-next-line no-new
new App();

process.once('SIGUSR2', () => {
  Logger.info('Stopping Discord.js client');
  const loader = Logger.loader(
    { spinner: 'aesthetic', color: 'cyan' },
    'Disconnecting Discord bot to Discord ...',
    'info',
  );

  if (Store.client !== null) {
    Store.client.destroy();
  }
  loader.succeed();
  Logger.info('Discord bot successfully disconnected');
  process.kill(process.pid, 'SIGUSR2');
});
