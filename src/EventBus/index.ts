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
 * @exports Libraries.EventBus
 */

type EventName = string;
type EventCallbackArgs = unknown[];
type EventCallbackIsAsync = boolean;

export interface EventTriggerSettings {
  event: EventName;
  args?: EventCallbackArgs;
  async?: EventCallbackIsAsync;
}

export type Callable =
  | ((...args: EventCallbackArgs) => void)
  | ((...args: EventCallbackArgs) => Promise<void>);
export type Subscriber = Record<string, Callable[] | undefined>;

class EventBus {
  private static registry = {} as Subscriber;

  /**
   * @static
   *
   * @description It adds a callback to the event listener list.
   *
   * @param { EventName } event    - The name of the event you want to listen to.
   * @param { Callable }  callback - The callback function that will be called when the event is emitted.
   *
   * @example
   * EventBus.on('mySuperEvent', (payload) => {
   *   console.log('mySuperEvent was fired', payload);
   * });
   */
  static on(event: string, callback: Callable): void {
    const key = `_${event}`;
    if (!this.registry[key]) this.registry[key] = [];

    Logger.debug(`Listening "${event}" event`);
    this.registry[key]?.push(callback);
  }

  /**
   * @static
   *
   * @description It calls all the callbacks associated with the emitted event.
   *
   * @param   { EventTriggerSettings } settings         - Configuration of emitted event.
   * @param   { EventName }            settings.event   - The name of the event to emit.
   * @param   { EventCallbackArgs }    [settings.args]  - List of arguments passed to callbacks.
   * @param   { EventCallbackIsAsync } [settings.async] - Wether callbacks should be ran asynchronously or not.
   *
   * @returns { Promise<void> }                         - A promise that resolves when all callbacks have been executed.
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
  static async emit({
    event,
    args = [],
    async = true,
  }: EventTriggerSettings): Promise<void> {
    const key = `_${event}`;
    if (this.registry[key] === undefined) return;

    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-non-null-assertion
    for (const callback of this.registry[key]!) {
      if (async) {
        void callback(...args);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await callback(...args);
      }
    }
    Logger.debug(`Event "${event}" dispatched`);
  }
}

export default EventBus;
