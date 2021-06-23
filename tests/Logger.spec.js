import Logger from '$src/Logger';

describe('Logger', () => {
  describe('Date calculator', () => {
    describe('getYear', () => {
      it("should return today's year", () => {
        const todayDate = new Date();
        expect(Logger.getYear(todayDate)).toEqual(todayDate.getFullYear());
      });
      it("should return given day's year", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getYear(date)).toEqual(date.getFullYear());
      });
    });

    describe('getMonth', () => {
      it("should return today's month", () => {
        const todayDate = new Date(); // 2009-11-10
        const month = todayDate.toLocaleString('default', { month: 'short' });
        expect(Logger.getMonth(todayDate)).toEqual(month);
      });
      it("should return given day's month", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        const month = date.toLocaleString('default', { month: 'short' });
        expect(Logger.getMonth(date)).toEqual(month);
      });
    });

    describe('getDay', () => {
      it("should return today's day", () => {
        const todayDate = new Date();
        expect(Logger.getDay(todayDate)).toEqual(
          `0${todayDate.getDate()}`.slice(-2),
        );
      });
      it("should return given day's day", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getDay(date)).toEqual(`0${date.getDate()}`.slice(-2));
      });
    });

    describe('getHour', () => {
      it("should return instant moment's hour", () => {
        const todayDate = new Date();
        expect(Logger.getHours(todayDate)).toEqual(
          `0${todayDate.getHours()}`.slice(-2),
        );
      });
      it("should return given moment's hour", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getHours(date)).toEqual(`0${date.getHours()}`.slice(-2));
      });
    });

    describe('getMinutes', () => {
      it("should return instant moment's minutes", () => {
        const todayDate = new Date();
        expect(Logger.getMinutes(todayDate)).toEqual(
          `0${todayDate.getMinutes()}`.slice(-2),
        );
      });
      it("should return given moment's minutes", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getMinutes(date)).toEqual(
          `0${date.getMinutes()}`.slice(-2),
        );
      });
    });

    describe('getSeconds', () => {
      it("should return instant moment's seconds", () => {
        const todayDate = new Date();
        expect(Logger.getSeconds(todayDate)).toEqual(
          `0${todayDate.getSeconds()}`.slice(-2),
        );
      });
      it("should return given moment's seconds", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getSeconds(date)).toEqual(
          `0${date.getSeconds()}`.slice(-2),
        );
      });
    });

    describe('getMilliseconds', () => {
      it("should return instant moment's milliseconds", () => {
        const todayDate = new Date();
        expect(Logger.getMilliseconds(todayDate)).toEqual(
          `00${todayDate.getMilliseconds()}`.slice(-3),
        );
      });
      it("should return given moment's milliseconds", () => {
        const startDate = new Date(0).getTime();
        const endDate = new Date().getTime();
        const date = new Date(
          startDate + Math.random() * (endDate - startDate),
        );
        expect(Logger.getMilliseconds(date)).toEqual(
          `00${date.getMilliseconds()}`.slice(-3),
        );
      });
    });

    describe('getDateTime', () => {
      it("should return instant moment's datetime", () => {
        const todayDate = new Date();

        const year = Logger.getYear(todayDate);
        const month = Logger.getMonth(todayDate);
        const day = Logger.getDay(todayDate);

        const hours = Logger.getHours(todayDate);
        const minutes = Logger.getMinutes(todayDate);
        const seconds = Logger.getSeconds(todayDate);
        const milliseconds = Logger.getMilliseconds(todayDate);

        const expected = `${year} ${month} ${day} - ${hours}:${minutes}:${seconds},${milliseconds}`;
        // need to crop last two digits of milliseconds to catch delay within test execution
        expect(Logger.getDateTime()).toEqual(
          expect.stringContaining(expected.slice(0, -2)),
        );
      });
    });
  });
});
