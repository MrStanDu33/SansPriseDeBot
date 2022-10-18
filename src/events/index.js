/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import fs from 'fs';
import EventBus from '$src/EventBus';

const promises = [];
const eventFilesLocations = ['App', 'Discord'];

const eventFilesFilter = (file) => {
  const fileIsHidden = file.indexOf('.') === 0;
  const fileIsIndex = file === 'index.js';
  const fileIsJs = file.slice(-3) === '.js';

  return !fileIsHidden && !fileIsIndex && fileIsJs;
};

const eventFileHandler = async (eventFilesLocation, file) => {
  const event = await import(`./${eventFilesLocation}/${file}`);
  const fileName = file.split('.').slice(0, -1).join('.');
  EventBus.on(`${eventFilesLocation}_${fileName}`, event.default);
  return true;
};

/* eslint-disable implicit-arrow-linebreak,function-paren-newline */
eventFilesLocations.forEach((eventFilesLocation) => {
  fs.readdirSync(`./src/events/${eventFilesLocation}`)
    .filter(eventFilesFilter)
    .forEach((file) =>
      promises.push(eventFileHandler(eventFilesLocation, file)),
    );
});
/* eslint-enable implicit-arrow-linebreak,function-paren-newline */

await Promise.all(promises);
