/**
 * @file EventBus configurator to register App and Discord events listener.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import fs from 'fs';
import EventBus from '$src/EventBus';

const promises = [];
const eventFilesLocations = ['App', 'Discord'];

/**
 * @description Tells file auto importer wether to import this file or not.
 * File is imported if :
 * - The file name does not start with a dot (hidden files).
 * - The file name is not `index.js`, aka this file name.
 * - The file name ends with `.js` extension.
 *
 * @param   { string }  file - The name of the file being checked.
 * @returns { boolean }      - Wether the file must be imported or ignored.
 */
const eventFilesFilter = (file) => {
  const fileIsHidden = file.indexOf('.') === 0;
  const fileIsIndex = file === 'index.js';
  const fileIsJs = file.slice(-3) === '.js';

  return !fileIsHidden && !fileIsIndex && fileIsJs;
};

/**
 * @description It imports the file, gets the file name,
 * and then register the event to the EventBus.
 *
 * @param   { string }           eventFilesLocation - This is the folder name where
 *                                                  the event files are located.
 * @param   { string }           file               - The file name of the event file.
 *
 * @returns { Promise<boolean> }                    - True when operation done.
 */
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
