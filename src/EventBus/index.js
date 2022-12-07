/**
 * @file Custom event bus.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger';

/**
 * @class
 * @description EventBus library.
 *
 * @hideconstructor
 *
 * @exports Libraries/EventBus
 */
class EventBus {
  /**
   * @static
   *
   * @description It adds a callback to the event listener list.
   *
   * @param { string }   event    - The name of the event you want to listen to.
   * @param { Function } callback - The callback function that will be called when the event is emitted.
   *
   * @throws  { Error } Thrown if argument is not valid.
   *
   * @example
   * EventBus.on('mySuperEvent', (payload) => {
   *   console.log('mySuperEvent was fired', payload);
   * });
   */
  static on(event, callback) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }

    if (!callback || typeof callback !== 'function') {
      throw new Error('please provide a valid callback');
    }

    if (!this[`_${event}`]) this[`_${event}`] = [];

    Logger.debug(`Listening "${event}" event`);
    this[`_${event}`].push(callback);
  }

  /**
   * @static
   *
   * @description It calls all the callbacks associated with the emitted event.
   *
   * @param { object }     settings         - Configuration of emitted event.
   * @param { string }     settings.event   - The name of the event to emit.
   * @param { Array<any> } [settings.args]  - List of arguments passed to callbacks.
   * @param { boolean }    [settings.async] - Wether callbacks should be ran asynchronously or not.
   *
   * @throws { Error } Thrown if argument is not valid.
   *
   * @example
   * await EventBus.emit({
   *   event: 'mySuperEvent',
   *   args: [{
   *     name: 'payload',
   *     type: 'message',
   *     quantity: 12,
   *   }],
   *   async: false,
   * });
   */
  static async emit({ event, args = [], async = true } = { event: '' }) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }
    if (this[`_${event}`] === undefined) return;

    // TODO: Add sync/async condition
    // eslint-disable-next-line no-restricted-syntax
    for (const callback of this[`_${event}`]) {
      if (async === false) {
        // eslint-disable-next-line no-await-in-loop
        await callback(...args);
      } else {
        callback(...args);
      }
    }
    Logger.debug(`Event "${event}" dispatched`);
  }
}

export default EventBus;
