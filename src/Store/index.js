/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

export default new Proxy(
  {},
  {
    get(target, key, receiver) {
      if (!Reflect.has(target, `_${key}`)) {
        return undefined;
      }
      return Reflect.get(target, `_${key}`, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, `_${key}`, value, receiver);
    },
  },
);
