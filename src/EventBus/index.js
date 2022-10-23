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
 * @category Libraries
 */
class EventBus {
  /**
   * @static
   *
   * @description It adds a callback to the event listener list.
   *
   * @param { string }   event - The name of the event you want to listen to.
   * @param { Function } cb    - The callback function that will be called when the event is emitted.
   *
   * @throws  { Error } Thrown if argument is not valid.
   */
  static on(event, cb) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }

    if (!cb || typeof cb !== 'function') {
      throw new Error('please provide a valid callback');
    }

    if (!this[`_${event}`]) this[`_${event}`] = [];

    Logger.debug(`Listening "${event}" event`);
    this[`_${event}`].push(cb);
  }

  /**
   * @static
   *
   * @description It calls all the callbacks associated with the emitted event.
   *
   * @param { string } event - The name of the event to emit.
   * @param { any }    args  - The arguments passed to callbacks.
   *
   * @throws { Error } Thrown if argument is not valid.
   */
  static emit(event, ...args) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }
    if (!this[`_${event}`]) return;

    this[`_${event}`].forEach((cb) => cb(...args));
    Logger.debug(`Event "${event}" dispatched`);
  }
}

export default EventBus;
