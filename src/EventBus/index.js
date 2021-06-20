export default {
  on(event, cb) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }

    if (!cb || typeof cb !== 'function') {
      throw new Error('please provide an valid callback');
    }

    this[`_${event}`] = cb;
  },
  emit(event, ...args) {
    if (!event || typeof event !== 'string' || event.length <= 0) {
      throw new Error('please provide an event name');
    }
    if (!this[`_${event}`]) return;

    this[`_${event}`](...args);
  },
};
