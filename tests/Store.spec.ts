/**
 * @file Test global store.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Store from '$src/Store';

describe('Store', () => {
  describe('Setter', () => {
    it('Should store the data', () => {
      // @ts-expect-error Error forced for test purposes
      Store.thing = 'exist';

      // @ts-expect-error Error forced for test purposes
      expect(Store.thing).toBe('exist');
    });
  });

  describe('Getter', () => {
    beforeEach(() => {
      // @ts-expect-error Error forced for test purposes
      Store.thing = 'exist';
    });

    it('Should return the data', () => {
      // @ts-expect-error Initialized on beforeEach hook
      expect(Store.thing).toBe('exist');
      // @ts-expect-error Error forced for test purposes
      expect(Store.anotherThing).toBe(undefined);
    });
  });
});
