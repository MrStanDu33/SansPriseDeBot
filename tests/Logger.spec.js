/**
 * @file Test Logger class.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */
// @ts-nocheck

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

      /**
       * @function terminalCallback
       * @description Prevent terminal refresh.
       */
      const terminalCallback = () => {};

      stream.clearLine = terminalCallback;
      stream.cursorTo = terminalCallback;
      stream.moveCursor = terminalCallback;

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

      expect(spinner.isSpinning).toBe(true);
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
      process.env.APP_DEBUG = 'true';
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
        Logger.error(true, 'test');

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
    const env = {};

    beforeEach(() => {
      env.APP_DEBUG = process.env.APP_DEBUG;
      process.env.APP_DEBUG = 'true';
      consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
      consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      process.env.APP_DEBUG = env.APP_DEBUG;
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
        Logger.errorToConsole(true, 'test');
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
});
