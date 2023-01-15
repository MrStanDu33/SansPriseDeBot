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
import Store from '$src/Store';

/** @typedef { import('ora').Color } Color */
/** @typedef { import('ora').Options } SpinnerSettings */
/** @typedef { import('ora').Ora } Loader */

/**
 * @class
 * @description Logger library.
 *
 * @hideconstructor
 *
 * @exports Libraries/Logger
 */
class Logger {
  /**
   * @static
   *
   * @description It creates a new ora instance with the given spinner and message, and starts
   * the spinner. It also logs the message to the console using the given logType.
   *
   * @param   { SpinnerSettings }               spinnerSettings - A spinner configuration.
   * @param   { any }                           message         - The message to print while the loader is spinning.
   * @param   { 'debug'|'info'|'warn'|'error' } logType         - The type of log to print to the console.
   *
   * @throws  { Error }                                         - Thrown if argument is not valid.
   *
   * @returns { Loader }                                        - The spinner instance.
   *
   * @example
   * // create a new loader ...
   * const loader = Logger.loader({ spinner: 'aesthetic', color: 'cyan' }, 'This is a loading message', info);
   *
   * // stop loader and mark it as done
   * loader.succeed();
   *
   * // stop loader and mark it as failed
   * loader.fail();
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
   * @param   { ...any } debug - Debug messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.debug('This is a debug message', 12, false);
   */
  static debug(...debug) {
    Logger.debugToConsole(...debug);
    Logger.debugToFile(...debug);
  }

  /**
   * @static
   *
   * @description Prints given info messages to the console, to discord debug channel and to
   * log file in info mode.
   *
   * @param   { ...any } info - Info messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.info('This is an info message', false, 20);
   */
  static info(...info) {
    Logger.infoToConsole(...info);
    Logger.infoToFile(...info);
    Logger.infoToDiscord(...info);
  }

  /**
   * @static
   *
   * @description Prints given warning messages to the console, to discord debug channel and to
   * log file in warning mode.
   *
   * @param   { ...any } warn - Warning messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.warn('This is a warn message', true, 42);
   */
  static warn(...warn) {
    Logger.warnToConsole(...warn);
    Logger.warnToFile(...warn);
    Logger.warnToDiscord(...warn);
  }

  /**
   * @static
   *
   * @description Prints given error messages to the console, to discord debug channel and to
   * log file in error mode.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }       [ error ] - Data to be logged.
   * @param   { boolean } error[].0 - If set to true, log error as fatal.
   * @param   { ...any }  error[].1 - Error messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.error('This is an error message', 45, false);
   *
   * Logger.error(true, 'This is a fatal error message', 12, false); // note the first param being a boolean set to true, it will not be logged in console nor file
   */
  static error(...error) {
    Logger.errorToConsole(...error);
    Logger.errorToFile(...error);
    Logger.errorToDiscord(...error);
  }

  /**
   * @static
   *
   * @description Prints given info messages to the discord log channel.
   *
   * @param   { ...any } info - Info messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.infoToDiscord('This is an info message', false, 20);
   */
  static infoToDiscord(...info) {
    Logger.#writeToDiscordLogChannel(
      `${Logger.#prefixes.console.info} | ${
        info.length === 1 && typeof info[0] === 'string'
          ? info[0]
          : JSON.stringify(info)
      }`,
    );
  }

  /**
   * @static
   *
   * @description Prints given info messages to the discord log channel.
   *
   * @param   { ...any } warn - Warning messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.warnToConsole('This is a warn message', true, 42);
   */
  static warnToDiscord(...warn) {
    Logger.#writeToDiscordLogChannel(
      `${Logger.#prefixes.console.warn} | ${
        warn.length === 1 && typeof warn[0] === 'string'
          ? warn[0]
          : JSON.stringify(warn)
      }`,
    );
  }

  /**
   * @static
   *
   * @description Prints given error messages to the discord log channel.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }       [ error ] - Data to be logged.
   * @param   { boolean } error[].0 - If set to true, log error as fatal.
   * @param   { ...any }  error[].1 - Error messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.errorToDiscord('This is an error message', 45, false);
   *
   * Logger.errorToDiscord(true, 'This is a fatal error message', 12, false); // note the first param being a boolean set to true, it will not be logged in console
   */
  static errorToDiscord(...error) {
    const fatal = error.length > 1 && error[0] === true && error.shift();
    const flag = fatal ? 'fatal' : 'error';
    Logger.#writeToDiscordLogChannel(
      `${Logger.#prefixes.console[flag]} | ${
        error.length === 1 && typeof error[0] === 'string'
          ? error[0]
          : JSON.stringify(error)
      }`,
    );
  }

  /**
   * @static
   *
   * @async
   *
   * @description Writes given data to the discord channel dedicated to log specified with
   * the DISCORD_LOG_CHANNEL_ID environment variable.
   *
   * @param   { ...string }     data - Data to write into the log file.
   *
   * @returns { Promise<void> }
   *
   * @example
   * Logger.#writeToDiscordLogChannel('this is an example message to log');
   */
  static async #writeToDiscordLogChannel(...data) {
    try {
      const { DISCORD_SERVER_ID, DISCORD_LOG_CHANNEL_ID } = process.env;
      const { client } = Store;
      const guild = await client.guilds.fetch(DISCORD_SERVER_ID);
      const channel = await guild.channels.fetch(DISCORD_LOG_CHANNEL_ID);
      // eslint-disable-next-line no-restricted-syntax
      for (const message of data) {
        // eslint-disable-next-line no-await-in-loop
        await channel.send(message);
      }
    } catch (error) {
      Logger.errorToConsole(
        `Unable to send log message to discord channel with given id ${process.env.DISCORD_LOG_CHANNEL_ID}`,
        error,
      );
      Logger.errorToFile(
        `Unable to send log message to discord channel with given id ${process.env.DISCORD_LOG_CHANNEL_ID}`,
        error,
      );
    }
  }

  /**
   * @static
   *
   * @description Prints given debug messages to the console in log mode.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the console.
   *
   * @param   { ...any } debug - Debug messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.debugToConsole('This is a debug message', 12, false);
   */
  static debugToConsole(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    // eslint-disable-next-line no-console
    console.log(`${Logger.#prefixes.console.debug} |`, ...debug);
  }

  /**
   * @static
   *
   * @description Prints given info messages to the console in log mode.
   *
   * @param   { ...any } info - Info messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.infoToConsole('This is an info message', false, 20);
   */
  static infoToConsole(...info) {
    // eslint-disable-next-line no-console
    console.log(`${Logger.#prefixes.console.info} |`, ...info);
  }

  /**
   * @static
   *
   * @description Prints given warning messages to the console in warn mode.
   *
   * @param   { ...any } warn - Warning messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.warnToConsole('This is a warn message', true, 42);
   */
  static warnToConsole(...warn) {
    // eslint-disable-next-line no-console
    console.warn(`${Logger.#prefixes.console.warn} |`, ...warn);
  }

  /**
   * @static
   *
   * @description Prints given error messages to the console in error or fatal mode.
   * If first given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param   { * }       [ error ] - Data to be logged.
   * @param   { boolean } error[].0 - If set to true, log error as fatal.
   * @param   { ...any }  error[].1 - Error messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.errorToConsole('This is an error message', 45, false);
   *
   * Logger.errorToConsole(true, 'This is a fatal error message', 12, false); // note the first param being a boolean set to true, it will not be logged in console
   */
  static errorToConsole(...error) {
    const fatal = error.length > 1 && error[0] === true && error.shift();
    const method = fatal ? 'error' : 'log';
    const flag = fatal ? 'fatal' : 'error';
    // eslint-disable-next-line no-console
    console[method](`${Logger.#prefixes.console[flag]} |`, ...error);
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
   *
   * @example
   * Logger.#writeToLogFile('this is an example message to log');
   */
  static #writeToLogFile(...data) {
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
   * @param   { ...any } debug - Debug messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.debugToFile('This is a debug message', 12, false);
   */
  static debugToFile(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    debug.forEach((debugData) => {
      Logger.#writeToLogFile(
        `${Logger.#getDateTime()} | ${
          Logger.#prefixes.file.debug
        } | ${Logger.#getCaller()} | ${debugData}`,
      );
    });
  }

  /**
   * @static
   *
   * @description Writes given info messages to the log file.
   * It will automatically prefix info messages with date-time and caller.
   *
   * @param   { ...any } info - Info messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.infoToFile('This is an info message', false, 20);
   */
  static infoToFile(...info) {
    info.forEach((infoData) => {
      Logger.#writeToLogFile(
        `${Logger.#getDateTime()} | ${
          Logger.#prefixes.file.info
        } | ${Logger.#getCaller()} | ${infoData}`,
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
   * @param   { ...any } warn - Warning messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.warnToFile('This is a warn message', true, 42);
   */
  static warnToFile(...warn) {
    warn.forEach((warnData) => {
      Logger.#writeToLogFile(
        `${Logger.#getDateTime()} | ${
          Logger.#prefixes.file.warn
        } | ${Logger.#getCaller()} | ${warnData}`,
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
   * @param   { * }       [ error ] - Data to be logged.
   * @param   { boolean } error[].0 - If set to true, log error as fatal.
   * @param   { ...any }  error[].1 - Error messages to be logged.
   *
   * @returns { void }
   *
   * @example
   * Logger.errorToFile('This is an error message', 45, false);
   *
   * Logger.errorToFile(true, 'This is a fatal error message', 12, false); // note the first param being a boolean set to true, it will not be written in file
   */
  static errorToFile(...error) {
    error.forEach((errorData, index) => {
      if (errorData === true && index === 0) return;

      Logger.#writeToLogFile(
        `${Logger.#getDateTime()} | ${
          Logger.#prefixes.file.error
        } | ${Logger.#getCaller()} | ${errorData}`,
      );
    });
  }

  /**
   * @static
   *
   * @property { object } prefixes               - List of prefixes to use for logging.
   *
   * @property { object } prefixes.console       - List of prefixes to use for console logging.
   * @property { string } prefixes.console.debug - Colored prefix for debug messages in console.
   * @property { string } prefixes.console.info  - Colored prefix for info messages in console.
   * @property { string } prefixes.console.warn  - Colored prefix for warnings in console.
   * @property { string } prefixes.console.error - Colored prefix for errors in console.
   * @property { string } prefixes.console.fatal - Colored prefix for fatal errors in console.
   *
   * @property { object } prefixes.file          - List of prefixes to use for log file logging.
   * @property { string } prefixes.file.debug    - Prefix for debug messages in log file.
   * @property { string } prefixes.file.info     - Prefix for info messages in log file.
   * @property { string } prefixes.file.warn     - Prefix for warnings in log file.
   * @property { string } prefixes.file.error    - Prefix for errors in log file.
   * @property { string } prefixes.file.fatal    - Prefix for fatal errors in log file.
   */
  static #prefixes = {
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
   *
   * @example
   * const date = new Date('2018-09-22T15:12:00.154');
   * const year = Logger.#getYear(date);
   *
   * console.log(year); // '2018'
   */
  static #getYear(date) {
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
   *
   * @example
   * const date = new Date('2018-09-22T15:12:00.154');
   * const month = Logger.#getMonth(date);
   *
   * console.log(month); // 'Sep'
   */
  static #getMonth(date) {
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
   *
   * @example
   * const date1 = new Date('2018-09-22T15:12:25.154');
   * const date2 = new Date('2018-09-02T15:12:25.154');
   * const day1 = Logger.#getDay(date1);
   * const day2 = Logger.#getDay(date2);
   *
   * console.log(day1); // '22'
   * console.log(day2); // '02'
   */
  static #getDay(date) {
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
   *
   * @example
   * const date1 = new Date('2018-09-22T15:12:25.154');
   * const date2 = new Date('2018-09-22T05:12:25.154');
   * const hour1 = Logger.#getHours(date1);
   * const hour2 = Logger.#getHours(date2);
   *
   * console.log(hour1); // '15'
   * console.log(hour2); // '05'
   */
  static #getHours(date) {
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
   *
   * @example
   * const date1 = new Date('2018-09-22T15:12:25.154');
   * const date2 = new Date('2018-09-22T15:02:25.154');
   * const minute1 = Logger.#getMinutes(date1);
   * const minute2 = Logger.#getMinutes(date2);
   *
   * console.log(minute1); // '12'
   * console.log(minute2); // '02'
   */
  static #getMinutes(date) {
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
   *
   * @example
   * const date1 = new Date('2018-09-22T15:12:25.154');
   * const date2 = new Date('2018-09-22T15:12:05.154');
   * const second1 = Logger.#getSeconds(date1);
   * const second = Logger.#getSeconds(date2);
   *
   * console.log(second1); // '25'
   * console.log(second2); // '05'
   */
  static #getSeconds(date) {
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
   *
   * @example
   * const date1 = new Date('2018-09-22T15:12:25.154');
   * const date2 = new Date('2018-09-22T15:12:25.001');
   * const milliSecond1 = Logger.#getMilliSeconds(date1);
   * const milliSecond = Logger.#getMilliSeconds(date2);
   *
   * console.log(milliSecond1); // '154'
   * console.log(milliSecond2); // '001'
   */
  static #getMilliseconds(date) {
    return `00${date.getMilliseconds()}`.slice(-3);
  }

  /**
   * @static
   *
   * @description Get the date-time of given date.
   *
   * @returns { string } - The data-time of the given date.
   *
   * @example
   * const date = new Date('2018-09-22T15:12:25.154');
   * const dateTime = Logger.#getDateTime(date);
   *
   * console.log(dateTime); // '2018 Sep 22 - 15:12:25,154'
   */
  static #getDateTime() {
    const date = new Date();

    const year = Logger.#getYear(date);
    const month = Logger.#getMonth(date);
    const day = Logger.#getDay(date);

    const hours = Logger.#getHours(date);
    const minutes = Logger.#getMinutes(date);
    const seconds = Logger.#getSeconds(date);
    const milliseconds = Logger.#getMilliseconds(date);

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
   *
   * @example
   * // file.js
   * function main () {
   *   const caller = Logger.#getCaller();
   *   console.log(caller); // '                file.js:2'
   * }
   *
   * main();
   */
  static #getCaller() {
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
