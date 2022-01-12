import { jest } from '@jest/globals';
import EventBus from '$src/EventBus';

describe('EventBus', () => {
  describe('Event Listener', () => {
    it("Should require event's name", () => {
      try {
        EventBus.on();

        expect(true).toBe(false); // force test to fail
      } catch (e) {
        expect(e.message).toBe('please provide an event name');
      }
    });

    it('Should require a callback', () => {
      try {
        EventBus.on('eventName');

        expect(true).toBe(false); // force test to fail
      } catch (e) {
        expect(e.message).toBe('please provide a valid callback');
      }
    });

    it('Should allow to register an event', () => {
      EventBus.on('eventName', () => {});

      // eslint-disable-next-line no-underscore-dangle
      expect(EventBus._eventName).toBeTruthy();
    });
  });

  describe('Event Emitter', () => {
    it("Should require event's name", () => {
      try {
        EventBus.emit();

        expect(true).toBe(false); // force test to fail
      } catch (e) {
        expect(e.message).toBe('please provide an event name');
      }
    });

    it('Should allow to emit an event', () => {
      const callback = jest.fn();
      EventBus.on('eventName', callback);

      EventBus.emit('eventName');
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalled();
    });

    it('Should allow to pass data', () => {
      const callback = jest.fn();
      EventBus.on('eventName', callback);

      EventBus.emit('eventName', 'test');
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalledWith('test');
    });

    it('Should allow to pass multiple data', () => {
      const callback = jest.fn();
      const data = ['test1', 'test2', true, 42];
      EventBus.on('eventName', callback);

      EventBus.emit('eventName', ...data);
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalledWith(...data);
    });
  });
});
