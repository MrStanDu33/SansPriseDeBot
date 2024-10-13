/**
 * @file Test EventBus class.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { jest } from '@jest/globals';
import EventBus from '$src/EventBus';

describe('EventBus', () => {
  let APP_DEBUG: string | undefined;
  beforeEach(() => {
    APP_DEBUG = process.env.APP_DEBUG;
    process.env.APP_DEBUG = 'false';
  });

  afterEach(() => {
    process.env.APP_DEBUG = APP_DEBUG;
  });
  describe('Event Listener', () => {
    it("Should require event's name", () => {
      expect(() => {
        // @ts-expect-error Error forced for test purposes
        EventBus.on();
      }).toThrow('please provide an event name');
    });

    it('Should require a callback', () => {
      expect(() => {
        // @ts-expect-error Error forced for test purposes
        EventBus.on('eventName');
      }).toThrow('please provide a valid callback');
    });

    it('Should allow to register an event', async () => {
      const callback = jest.fn();
      EventBus.on('eventName', callback);

      await EventBus.emit({ event: 'eventName' });
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Event Emitter', () => {
    it("Should require event's name", async () => {
      try {
        await EventBus.emit();
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('please provide an event name');
        }
      }
    });

    it('Should allow to emit an event', async () => {
      const callback = jest.fn();
      EventBus.on('eventName', callback);

      await EventBus.emit({ event: 'eventName' });
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalled();
    });

    it('Should allow to pass data', async () => {
      const callback = jest.fn();
      EventBus.on('eventName', callback);

      await EventBus.emit({ event: 'eventName', args: ['test'] });
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalledWith('test');
    });

    it('Should allow to pass multiple data', async () => {
      const callback = jest.fn();
      const data = ['test1', 'test2', true, 42];
      EventBus.on('eventName', callback);

      await EventBus.emit({ event: 'eventName', args: [...data] });
      // eslint-disable-next-line no-underscore-dangle
      expect(callback).toHaveBeenCalledWith(...data);
    });
  });
});
