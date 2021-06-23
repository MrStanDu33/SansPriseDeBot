import Store from '$src/Store';
import Logger from '$src/Logger';

export default (loader) => {
  loader.succeed();
  Logger.info(`Logged in as ${Store.client.user.tag}!`);
};
