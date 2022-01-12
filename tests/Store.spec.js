// eslint-disable-next-line import/no-unresolved
// import { jest } from '@jest/globals';
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

    it('Should store the data', () => {
      expect(Store.thing).toBe('exist');
      expect(Store.anotherThing).toBe(undefined);
    });
  });
});
