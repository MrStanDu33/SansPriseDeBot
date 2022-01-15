// eslint-disable-next-line import/no-unresolved
import { PassThrough } from 'node:stream';
import { jest } from '@jest/globals';
import Logger from '$src/Logger';
import fs from 'fs';

describe('Logger', () => {
  describe('loader', () => {
    it('check if message is given', () => {
      expect(() => {
        Logger.loader({});
      }).toThrowError(
        'Please provide a valid message to print while loader spinning',
      );
    });

    it('check if logType is given', () => {
      expect(() => {
        Logger.loader({}, 'this is a test message');
      }).toThrowError(
        'Please provide a valid log type (debug,info,warn,error)',
      );
    });

    it("check if given spinner's setting exist", () => {
      expect(() => {
        Logger.loader(
          {
            spinner: 'Not A Spinner',
          },
          'this is a test message',
          'info',
        );
      }).toThrowError('Please provide a spinner name');
    });

    it('calls start', async () => {
      const stream = new PassThrough();
      stream.clearLine = () => {};
      stream.cursorTo = () => {};
      stream.moveCursor = () => {};

      const spinner = Logger.loader(
        {
          color: 'cyan',
          spinner: 'aesthetic',
          isEnabled: true,
          stream,
        },
        'this is a test message',
        'info',
      );

      expect(spinner.id).toBeTruthy();
      expect(spinner.isEnabled).toBe(true);
    });
  });

  describe('Console and File loggers', () => {
    let writeFileMock;
    let consoleLogMock;
    let consoleWarnMock;
    let consoleErrorMock;
    const env = {};

    beforeEach(() => {
      env.APP_DEBUG = process.env.APP_DEBUG;
      process.env.APP_DEBUG = true;
      writeFileMock = jest.spyOn(fs, 'writeFile').mockImplementation();
      consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
      consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      process.env.APP_DEBUG = env.APP_DEBUG;
      writeFileMock.mockRestore();
      consoleLogMock.mockRestore();
      consoleWarnMock.mockRestore();
      consoleErrorMock.mockRestore();
    });

    describe('debug', () => {
      it('should print debug to console and log file', () => {
        Logger.debug('test');

        expect(writeFileMock).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalled();
      });
    });

    describe('info', () => {
      it('should print info to console and log file', () => {
        Logger.info('test');

        expect(writeFileMock).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalled();
      });
    });

    describe('warn', () => {
      it('should print warn to console and log file', () => {
        Logger.warn('test');

        expect(writeFileMock).toHaveBeenCalled();
        expect(consoleWarnMock).toHaveBeenCalled();
      });
    });

    describe('error', () => {
      it('should print error to console and log file', () => {
        Logger.error('test');
        Logger.error('test', true);

        expect(writeFileMock).toHaveBeenCalledTimes(2);
        expect(consoleLogMock).toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalled();
      });
    });
  });

  describe('Console loggers', () => {
    let consoleLogMock;
    let consoleWarnMock;
    let consoleErrorMock;

    beforeEach(() => {
      consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
      consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleLogMock.mockRestore();
      consoleWarnMock.mockRestore();
      consoleErrorMock.mockRestore();
    });

    describe('debugToConsole', () => {
      it('should print debug to console', () => {
        Logger.debugToConsole('test');

        expect(consoleLogMock).toHaveBeenCalled();
      });
    });

    describe('infoToConsole', () => {
      it('should print info to console', () => {
        Logger.infoToConsole('test');

        expect(consoleLogMock).toHaveBeenCalled();
      });
    });

    describe('warnToConsole', () => {
      it('should print warn to console', () => {
        Logger.warnToConsole('test');

        expect(consoleWarnMock).toHaveBeenCalled();
      });
    });

    describe('errorToConsole', () => {
      it('should print error to console', () => {
        Logger.errorToConsole('test');
        Logger.errorToConsole('test', true);
        expect(consoleLogMock).toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalled();
      });
    });
  });

  describe('File loggers', () => {
    let writeFileMock;
    const env = {};

    beforeEach(() => {
      env.APP_DEBUG = process.env.APP_DEBUG;
      process.env.APP_DEBUG = true;
      writeFileMock = jest.spyOn(fs, 'writeFile').mockImplementation();
    });

    afterEach(() => {
      writeFileMock.mockRestore();
      process.env.APP_DEBUG = env.APP_DEBUG;
    });

    describe('writeToLogFile', () => {
      it('should write into the log file', () => {
        Logger.writeToLogFile('Test');

        expect(writeFileMock).toHaveBeenCalled();
      });
    });

    describe('debugToFile', () => {
      it('should print debug to log file', () => {
        Logger.debugToFile('Test');

        expect(writeFileMock).toHaveBeenCalled();
      });
    });

    describe('infoToFile', () => {
      it('should print info to log file', () => {
        Logger.infoToFile('Test');

        expect(writeFileMock).toHaveBeenCalled();
      });
    });

    describe('warnToFile', () => {
      it('should print warn to log file', () => {
        Logger.warnToFile('Test');

        expect(writeFileMock).toHaveBeenCalled();
      });
    });

    describe('errorToFile', () => {
      it('should print error to log file', () => {
        Logger.errorToFile('Test');

        expect(writeFileMock).toHaveBeenCalled();
      });
    });
  });

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
      beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(1624540851150));
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      it("should return instant moment's datetime", () => {
        const year = 2021;
        const month = 'Jun';
        const day = 24;

        const hours = 15;
        const minutes = 20;
        const seconds = 51;
        const milliseconds = 150;

        const expected = `${year} ${month} ${day} - ${hours}:${minutes}:${seconds},${milliseconds}`;

        // need to ignores last two digits of milliseconds to catch delay within test execution
        expect(Logger.getDateTime().slice(0, -2)).toEqual(
          expected.slice(0, -2),
        );
      });
    });
  });

  describe('Call stack resolver', () => {
    describe('getCaller', () => {
      it('should give the name of the caller', () => {
        expect(Logger.getCaller(true)).toMatch(/^ {15}run\.js:[\d]{1,}$/);
        expect(Logger.getCaller(false)).toMatch(/^ {18}unknown$/);
      });
    });
  });
});
