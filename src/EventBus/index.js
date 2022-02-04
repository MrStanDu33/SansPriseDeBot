import Logger from '$src/Logger';

export default {
  /**
   * It adds a callback to the event listener list.
   *
   * @param event - The name of the event you want to listen to.
   * @param cb - The callback function that will be called when the event is emitted.
   * @returns {void}
   */
  on(event, cb) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }

    if (!cb || typeof cb !== 'function') {
      throw new Error('please provide a valid callback');
    }

    if (!this[`_${event}`]) this[`_${event}`] = [];

    Logger.debug(`Listening "${event}" event`);
    this[`_${event}`].push(cb);
  },
  emit(event, ...args) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }
    if (!this[`_${event}`]) return;

    this[`_${event}`].forEach((cb) => cb(...args));
    Logger.debug(`Event "${event}" dispatched`);
  },
};
