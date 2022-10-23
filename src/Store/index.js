/**
 * @file Custom global data store.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/**
 * @description Store library.
 *
 * @category Libraries
 *
 * @module Store
 */
const Store = new Proxy(
  {},
  {
    /**
     * @description Get the store data based on the data
     * name provided in the key.
     *
     * @param   { object }         target - Store object.
     * @param   { string }         key    - Key of requested data in store.
     *
     * @returns { undefined | any}        - Return whatever data has been stored
     *                                    or undefined if given key does not
     *                                    exist in store.
     */
    get(target, key) {
      if (!Reflect.has(target, `_${key}`)) {
        return undefined;
      }
      return Reflect.get(target, `_${key}`);
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
     */
    set(target, key, value) {
      return Reflect.set(target, `_${key}`, value);
    },
  },
);

export default Store;
