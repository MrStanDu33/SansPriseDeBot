import Logger from '$src/Logger';

export default {
  /**
   * @function on - It adds a callback to the event listener list.
   *
   * @param { string } event - The name of the event you want to listen to.
   * @param { Function } cb - The callback function that will be called when the event is emitted.
   *
   * @returns { void }
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

  /**
   * @function emit - It calls all the callbacks associated with the emitted event
   *
   * @param { string } event - The name of the event to emit.
   * @param { any } args - The arguments passed to callbacks.
   *
   * @returns {void}
   */
  emit(event, ...args) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }
    if (!this[`_${event}`]) return;

    this[`_${event}`].forEach((cb) => cb(...args));
    Logger.debug(`Event "${event}" dispatched`);
  },
};
