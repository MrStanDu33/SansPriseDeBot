/**
 * @file EventBus configurator to register App and Discord events listener.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import fs from 'fs';
import EventBus from '$src/EventBus';

const promises: Promise<boolean>[] = [];
const eventFilesLocations = ['App', 'Discord'];

interface Event {
  default: (...args: unknown[]) => Promise<void>;
}

/**
 * @description Tells file auto importer wether to import this file or not.
 * File is imported if :
 * - The file name does not start with a dot (hidden files).
 * - The file name is not `index.js`, aka this file name.
 * - The file name ends with `.js` extension.
 *
 * @memberof module:Libraries/EventBus
 *
 * @param   { string }  file - The name of the file being checked.
 * @returns { boolean }      - Wether the file must be imported or ignored.
 */
const eventFilesFilter = (file: string): boolean => {
  const fileIsHidden = file.startsWith('.');
  const fileIsIndex = file === 'index.js';
  const fileIsJs = file.endsWith('.js');

  return !fileIsHidden && !fileIsIndex && fileIsJs;
};

/**
 * @description It imports the file, gets the file name,
 * and then register the event to the EventBus.
 *
 * @memberof module:Libraries/EventBus
 *
 * @param   { string }           eventFilesLocation - This is the folder name where
 *                                                  the event files are located.
 * @param   { string }           file               - The file name of the event file.
 *
 * @returns { Promise<boolean> }                    - True when operation done.
 */
const eventFileHandler = async (
  eventFilesLocation: string,
  file: string,
): Promise<boolean> => {
  const event = (await import(`./${eventFilesLocation}/${file}`)) as Event;
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
