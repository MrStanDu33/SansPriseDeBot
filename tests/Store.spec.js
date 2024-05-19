/**
 * @file Test global store.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Store from '$src/Store';

describe('Store', () => {
  describe('Setter', () => {
    it('Should store the data', () => {
      Store.thing = 'exist';

      expect(Store.thing).toBe('exist');
    });
  });

  describe('Getter', () => {
    beforeEach(() => {
      Store.thing = 'exist';
    });

    it('Should return the data', () => {
      expect(Store.thing).toBe('exist');
      expect(Store.anotherThing).toBe(undefined);
    });
  });
});
