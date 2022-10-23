/**
 * @file Custom logger class.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import fs from 'fs';
import os from 'os';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { get } from 'stack-trace';
import cliSpinners from 'cli-spinners';

/** @typedef { import('ora').Color } Color */
/** @typedef { import('ora').Options } SpinnerSettings */
/** @typedef { import('ora').Ora } Loader */

/**
 * @class
 * @description Logger library.
 *
 * @category Libraries
 */
class Logger {
  /**
   * @static
   *
   * @description It creates a new ora instance with the given spinner and message, and starts
   * the spinner. It also logs the message to the console using the given logType.
   *
   * @param   { SpinnerSettings }               spinnerSettings - A spinner configuration.
   * @param   { string }                        message         - The message to print while the loader is spinning.
   * @param   { 'debug'|'info'|'warn'|'error' } logType         - The type of log to print to the console.
   *
   * @throws  { Error }                                         - Thrown if argument is not valid.
   *
   * @returns { Loader }                                        - The spinner instance.
   */
  static loader(spinnerSettings, message, logType) {
    if (typeof message !== 'string' || message.length === 0) {
      throw new Error(
        'Please provide a valid message to print while loader spinning',
      );
    }

    if (!['debug', 'info', 'warn', 'error'].includes(logType)) {
      throw new Error(
        'Please provide a valid log type (debug,info,warn,error)',
      );
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        cliSpinners,
        spinnerSettings.spinner,
      )
    ) {
      throw new Error(
        'Please provide a spinner name, see https://github.com/sindresorhus/cli-spinners',
      );
    }

    const spinnerInstance = ora({
      ...spinnerSettings,
      spinner:
        typeof spinnerSettings.spinner === 'string'
          ? cliSpinners[spinnerSettings.spinner]
          : spinnerSettings.spinner,
      text: message + os.EOL,
    }).start();

    const methodName = `${logType}ToFile`;
    Logger[methodName](message);

    return spinnerInstance;
  }

  /**
   * @static
   *
   * @description Prints given debug messages to the console and to log file in debug mode.
   *
   * @param   { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  static debug(...debug) {
    Logger.debugToConsole(...debug);
    Logger.debugToFile(...debug);
  }

  /**
   * @static
   *
   * @description Prints given info messages to the console and to log file in info mode.
   *
   * @param   { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  static info(...info) {
    Logger.infoToConsole(...info);
    Logger.infoToFile(...info);
  }

  /**
   * @static
   *
   * @description Prints given warning messages to the console and to log file in warning mode.
   *
   * @param   { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  static warn(...warn) {
    Logger.warnToConsole(...warn);
    Logger.warnToFile(...warn);
  }

  /**
   * @static
   *
   * @description Prints given error messages to the console and to log file in error mode.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }         [ error ] - Data to be logged.
   * @param   { boolean }   error[].0 - If set to true, log error as fatal.
   * @param   { ...string } error[].1 - Error messages to be logged.
   *
   * @returns { void }
   */
  static error(...error) {
    Logger.errorToConsole(...error);
    Logger.errorToFile(...error);
  }

  /**
   * @static
   *
   * @description Prints given debug messages to the console in log mode.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the console.
   *
   * @param   { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  static debugToConsole(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    // eslint-disable-next-line no-console
    console.log(`${Logger.prefixes.console.debug} |`, ...debug);
  }

  /**
   * @static
   *
   * @description Prints given info messages to the console in log mode.
   *
   * @param   { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  static infoToConsole(...info) {
    // eslint-disable-next-line no-console
    console.log(`${Logger.prefixes.console.info} |`, ...info);
  }

  /**
   * @static
   *
   * @description Prints given warning messages to the console in warn mode.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the console.
   *
   * @param   { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  static warnToConsole(...warn) {
    if (process.env.APP_DEBUG === 'false') return;
    // eslint-disable-next-line no-console
    console.warn(`${Logger.prefixes.console.warn} |`, ...warn);
  }

  /**
   * @static
   *
   * @description Prints given error messages to the console in error or fatal mode.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }         [ error ] - Data to be logged.
   * @param   { boolean }   error[].0 - If set to true, log error as fatal.
   * @param   { ...string } error[].1 - Error messages to be logged.
   *
   * @returns { void }
   */
  static errorToConsole(...error) {
    const fatal = error.length > 1 && error[0] === true && error.shift();
    const method = fatal ? 'error' : 'log';
    const flag = fatal ? 'fatal' : 'error';
    // eslint-disable-next-line no-console
    console[method](`${Logger.prefixes.console[flag]}`, ...error);
  }

  /**
   * @static
   *
   * @description Writes given data to the file specified in
   * the APP_DEBUG_FILE environment variable.
   *
   * @param   { ...string } data - Datas to write into the log file.
   *
   * @returns { void }
   */
  static writeToLogFile(...data) {
    fs.writeFile(
      process.env.APP_DEBUG_FILE,
      data + os.EOL,
      { flag: 'a' },
      (err) => {
        if (err) throw err;
      },
    );
  }

  /**
   * @static
   *
   * @description Writes given debug messages to the log file.
   * It will automatically prefix debug messages with date-time and caller.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the log file.
   *
   * @param   { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  static debugToFile(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    debug.forEach((debugData) => {
      Logger.writeToLogFile(
        `${Logger.getDateTime()} | ${
          Logger.prefixes.file.debug
        } | ${Logger.getCaller()} | ${debugData}`,
      );
    });
  }

  /**
   * @static
   *
   * @description Writes given info messages to the log file.
   * It will automatically prefix info messages with date-time and caller.
   *
   * @param   { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  static infoToFile(...info) {
    info.forEach((infoData) => {
      Logger.writeToLogFile(
        `${Logger.getDateTime()} | ${
          Logger.prefixes.file.info
        } | ${Logger.getCaller()} | ${infoData}`,
      );
    });
  }

  /**
   * @static
   *
   * @description Writes given warning messages to the log file.
   * It will automatically prefix warning messages with date-time and caller.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the log file.
   *
   * @param   { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  static warnToFile(...warn) {
    if (process.env.APP_DEBUG === 'false') return;
    warn.forEach((warnData) => {
      Logger.writeToLogFile(
        `${Logger.getDateTime()} | ${
          Logger.prefixes.file.warn
        } | ${Logger.getCaller()} | ${warnData}`,
      );
    });
  }

  /**
   * @static
   *
   * @description Writes given error messages to the log file.
   * It will automatically prefix error messages with date-time and caller.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }         [ error ] - Data to be logged.
   * @param   { boolean }   error[].0 - If set to true, log error as fatal.
   * @param   { ...string } error[].1 - Error messages to be logged.
   *
   * @returns { void }
   */
  static errorToFile(...error) {
    error.forEach((errorData) => {
      if (errorData === true) return;

      Logger.writeToLogFile(
        `${Logger.getDateTime()} | ${
          Logger.prefixes.file.error
        } | ${Logger.getCaller()} | ${errorData}`,
      );
    });
  }

  static prefixes = {
    console: {
      debug: chalk.blueBright('[DEBUG]'),
      info: chalk.greenBright('[INFO] '),
      warn: chalk.yellowBright('[WARN] '),
      error: chalk.redBright('[ERROR]'),
      fatal: chalk.red.bold('[FATAL]'),
    },
    file: {
      debug: '[DEBUG]',
      info: '[INFO] ',
      warn: '[WARN] ',
      error: '[ERROR]',
    },
  };

  /**
   * @static
   *
   * @description Get the year of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The year of the given date.
   */
  static getYear(date) {
    return `${date.getFullYear()}`;
  }

  /**
   * @static
   *
   * @description Get the month of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The month of the given date.
   */
  static getMonth(date) {
    return [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][date.getMonth()];
  }

  /**
   * @static
   *
   * @description Get the day of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The day of the given date.
   */
  static getDay(date) {
    return `0${date.getDate()}`.slice(-2);
  }

  /**
   * @static
   *
   * @description Get the hour of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The hour of the given date.
   */
  static getHours(date) {
    return `0${date.getHours()}`.slice(-2);
  }

  /**
   * @static
   *
   * @description Get the minute of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The minute of the given date.
   */
  static getMinutes(date) {
    return `0${date.getMinutes()}`.slice(-2);
  }

  /**
   * @static
   *
   * @description Get the second of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The second of the given date.
   */
  static getSeconds(date) {
    return `0${date.getSeconds()}`.slice(-2);
  }

  /**
   * @static
   *
   * @description Get the milliseconds of given date.
   *
   * @param   { Date }   date - Date to be parsed.
   *
   * @returns { string }      - The milliseconds of the given date.
   */
  static getMilliseconds(date) {
    return `00${date.getMilliseconds()}`.slice(-3);
  }

  /**
   * @static
   *
   * @description Get the date-time of given date.
   *
   * @returns { string } - The data-time of the given date.
   */
  static getDateTime() {
    const date = new Date();

    const year = Logger.getYear(date);
    const month = Logger.getMonth(date);
    const day = Logger.getDay(date);

    const hours = Logger.getHours(date);
    const minutes = Logger.getMinutes(date);
    const seconds = Logger.getSeconds(date);
    const milliseconds = Logger.getMilliseconds(date);

    // prints date & time in YYYY Mmm DD - HH:MM:SS,MS format
    return `${year} ${month} ${day} - ${hours}:${minutes}:${seconds},${milliseconds}`;
  }

  /**
   * @static
   *
   * @description Get the filename and line number of the caller.
   *
   * @returns { string } - The filename and line number of the caller or
   *                     'unknown' if the caller was not found.
   */
  static getCaller() {
    const source = get()[5].getFileName();

    if (source) {
      const filename = path.basename(source);
      const line = get()[5].getLineNumber();
      return `${filename}:${line}`.padStart(25, ' ');
    }

    return 'unknown'.padStart(25, ' ');
  }
}

export default Logger;
