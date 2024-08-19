/**
 * @file Custom global data store.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/**
 * @description Store library.
 *
 * @exports Libraries.Store
 */

export interface State {
  client: null | import('discord.js').Client;
}

const state: State = {
  client: null,
};

const Store = new Proxy(state, {
  /**
   * @description Get the store data based on the data
   * name provided in the key.
   *
   * @param   { object }  target - Store object.
   * @param   { string }  key    - Key of requested data in store.
   *
   * @returns { unknown }        - Return whatever data has been stored
   *                             or undefined if given key does not
   *                             exist in store.
   *
   * @example
   * const mySuperVariable = Store.mySuperKey;
   *
   * console.log(mySuperVariable); // whatever data has been stored.
   */
  get(target: object, key: string): unknown {
    const prefixedKey = `_${key}`;
    if (!Reflect.has(target, prefixedKey)) return undefined;
    return Reflect.get(target, prefixedKey) as unknown;
  },

  /**
   * @description Set a data in store based on the data
   * name provided in the key and given value.
   *
   * @param   { object }  target - Store object.
   * @param   { string }  key    - Key of requested data in store.
   * @param   { any }     value  - Key of requested data in store.
   *
   * @returns { boolean }        - Return true if data was successfully stored
   *                             or false if an error occurred.
   *
   * @example
   * Store.mySuperKey = 'This is a nice value';
   */
  set(target: object, key: string, value: unknown): boolean {
    const prefixedKey = `_${key}`;
    return Reflect.set(target, prefixedKey, value);
  },
}) as State;

export default Store;
