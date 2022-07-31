import fs from 'fs';
import os from 'os';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { get } from 'stack-trace';
import cliSpinners from 'cli-spinners';

/**
 * @typedef Spinner
 *
 * @property { ?number } interval - Interval between each frame.
 * @property { string[] } frames - List frames that composes the animated spinner.
 */

/**
 * @typedef { 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray' } Color
 */

/**
 * @typedef SpinnerSettings
 *
 * @param { string } [text] - Text to display after the spinner.
 * @param { string } [prefixText] - Text or a function that returns text to
 * display before the spinner. No prefix text will be displayed if set to an empty string.
 * @param { string | Spinner } [spinner = 'dots'] - Name of one of the provided spinners.
 * See [`example.js`](https://github.com/BendingBender/ora/blob/main/example.js) in this repo
 * if you want to test out different spinners. On Windows, it will always use the line spinner
 * as the Windows command-line doesn't have proper Unicode support.
 * @param { Color } [color = 'cyan'] - Color of the spinner.
 * @param { boolean } [hideCursor = true] - Set to `false` to stop Ora from hiding the cursor.
 * @param { number } [indent = 0] - Indent the spinner with the given number of spaces.
 * @param { number } [interval] - Interval between each frame. Spinners provide their own
 * recommended interval, so you don't really need to specify this.
 * @param { object } [stream = process.stderr] - Stream to write the output.
 * @param { boolean } [isEnabled] - Force enable/disable the spinner. If not specified, the spinner
 * will be enabled if the `stream` is being run inside a TTY context (not spawned or piped) and/or
 * not in a CI environment. Note that `false` doesn't mean it won't output anything. It just means
 * it won't output the spinner, colors, and other ansi escape codes. It will still log text.
 * @param { boolean } [isSilent = false] Disable the spinner and all log text. All output is
 * suppressed and `isEnabled` will be considered `false`.
 * @param { boolean } [discardStdin = true] Discard stdin input (except Ctrl+C) while running if
 * it's TTY. This prevents the spinner from twitching on input, outputting broken lines on `Enter`
 * key presses, and prevents buffering of input while the spinner is running. This has no effect on
 * Windows as there's no good way to implement discarding stdin properly there.
 */

export default {
  /**
   * @function loader - It creates a new ora instance with the given spinner and message, and starts
   * the spinner. It also logs the message to the console using the given logType
   *
   * @param { SpinnerSettings } spinnerSettings - A spinner configuration
   * @param { string } message - The message to print while the loader is spinning.
   * @param { 'debug'|'info'|'warn'|'error' } logType - The type of log to print to the console.
   *
   * @returns { object } - The spinner instance.
   */
  loader(spinnerSettings, message, logType) {
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
      spinner: cliSpinners[spinnerSettings.spinner],
      text: message + os.EOL,
    }).start();

    const methodName = `${logType}ToFile`;
    this[methodName](message);

    return spinnerInstance;
  },

  /**
   * @function debug - Prints given debug messages to the console and to log file in debug mode.
   *
   * @param { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  debug(...debug) {
    this.debugToConsole(...debug);
    this.debugToFile(...debug);
  },

  /**
   * @function info - Prints given info messages to the console and to log file in info mode.
   *
   * @param { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  info(...info) {
    this.infoToConsole(...info);
    this.infoToFile(...info);
  },

  /**
   * @function warn - Prints given warning messages to the console and to log file in warning mode.
   *
   * @param { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  warn(...warn) {
    this.warnToConsole(...warn);
    this.warnToFile(...warn);
  },

  /**
   * @function error - Prints given error messages to the console and to log file in error mode.
   *
   * @param { ...<boolean|string> } [ error ] - Error messages to be logged.
   * If the first parameter is a boolean and there is at least two parameters,
   * reported error is shown as fatal.
   *
   * @returns { void }
   */
  error(...error) {
    this.errorToConsole(...error);
    this.errorToFile(...error);
  },

  /**
   * @function debugToConsole - Prints given debug messages to the console in log mode.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the console.
   *
   * @param { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  debugToConsole(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.debug} |`, ...debug);
  },

  /**
   * @function infoToConsole - Prints given info messages to the console in log mode.
   *
   * @param { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  infoToConsole(...info) {
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.info} |`, ...info);
  },

  /**
   * @function warnToConsole - Prints given warning messages to the console in warn mode.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the console.
   *
   * @param { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  warnToConsole(...warn) {
    if (process.env.APP_DEBUG === 'false') return;
    // eslint-disable-next-line no-console
    console.warn(`${this.prefixes.console.warn} |`, ...warn);
  },

  /**
   * @function errorToConsole - Prints given error messages to the console in error or fatal mode.
   * if last given argument is a boolean and is evaluated as true, the function will log the error
   * in fatal mode.
   *
   * @param { ...<boolean|string> } [ error ] - Error messages to be logged.
   * If the first parameter is a boolean and there is at least two parameters,
   * reported error is shown as fatal.
   *
   * @returns { void }
   */
  errorToConsole(...error) {
    const fatal = error.length > 1 && error[0] === true && error.shift();
    const method = fatal ? 'error' : 'log';
    const flag = fatal ? 'fatal' : 'error';
    // eslint-disable-next-line no-console
    console[method](`${this.prefixes.console[flag]}`, ...error);
  },

  /**
   * @function writeToLogFile - Writes given data to the file specified in
   * the APP_DEBUG_FILE environment variable.
   *
   * @param { ...string } data - Datas to write into the log file.
   *
   * @returns { void }
   */
  writeToLogFile(...data) {
    fs.writeFile(
      process.env.APP_DEBUG_FILE,
      data + os.EOL,
      { flag: 'a' },
      (err) => {
        if (err) throw err;
      },
    );
  },

  /**
   * @function debugToFile - Writes given debug messages to the log file.
   * It will automatically prefix debug messages with date-time and caller.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the log file.
   *
   * @param { ...string } debug - Debug messages to be logged.
   *
   * @returns { void }
   */
  debugToFile(...debug) {
    if (process.env.APP_DEBUG === 'false') return;
    debug.forEach((debugData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.debug} | ${this.getCaller(
          true,
        )} | ${debugData}`,
      );
    });
  },

  /**
   * @function infoToFile - Writes given info messages to the log file.
   * It will automatically prefix info messages with date-time and caller.
   *
   * @param { ...string } info - Info messages to be logged.
   *
   * @returns { void }
   */
  infoToFile(...info) {
    info.forEach((infoData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.info} | ${this.getCaller(
          true,
        )} | ${infoData}`,
      );
    });
  },

  /**
   * @function warnToFile - Writes given warning messages to the log file.
   * It will automatically prefix warning messages with date-time and caller.
   * If the APP_DEBUG environment variable is set to false, then the function will not
   * log anything to the log file.
   *
   * @param { ...string } warn - Warning messages to be logged.
   *
   * @returns { void }
   */
  warnToFile(...warn) {
    if (process.env.APP_DEBUG === 'false') return;
    warn.forEach((warnData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.warn} | ${this.getCaller(
          true,
        )} | ${warnData}`,
      );
    });
  },

  /**
   * @function errorToFile - Writes given error messages to the log file.
   * It will automatically prefix error messages with date-time and caller.
   *
   * @param { ...string } error - Error messages to be logged.
   *
   * @returns { void }
   */
  errorToFile(...error) {
    error.forEach((errorData) => {
      if (errorData === true) return;

      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.error} | ${this.getCaller(
          true,
        )} | ${errorData}`,
      );
    });
  },

  prefixes: {
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
  },

  /**
   * @function getYear - Get the year of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The year of the given date.
   */
  getYear(date) {
    return `${date.getFullYear()}`;
  },

  /**
   * @function getMonth - Get the month of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The month of the given date.
   */
  getMonth(date) {
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
  },

  /**
   * @function getDay - Get the day of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The day of the given date.
   */
  getDay(date) {
    return `0${date.getDate()}`.slice(-2);
  },

  /**
   * @function getHour - Get the hour of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The hour of the given date.
   */
  getHours(date) {
    return `0${date.getHours()}`.slice(-2);
  },

  /**
   * @function getMinutes - Get the minute of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The minute of the given date.
   */
  getMinutes(date) {
    return `0${date.getMinutes()}`.slice(-2);
  },

  /**
   * @function getSeconds - Get the second of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The second of the given date.
   */
  getSeconds(date) {
    return `0${date.getSeconds()}`.slice(-2);
  },

  /**
   * @function getMilliseconds - Get the milliseconds of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The milliseconds of the given date.
   */
  getMilliseconds(date) {
    return `00${date.getMilliseconds()}`.slice(-3);
  },

  /**
   * @function getDateTime - Get the date-time of given date.
   *
   * @param { Date } date - Date to be parsed.
   *
   * @returns { string } - The data-time of the given date.
   */
  getDateTime() {
    const date = new Date();

    const year = this.getYear(date);
    const month = this.getMonth(date);
    const day = this.getDay(date);

    const hours = this.getHours(date);
    const minutes = this.getMinutes(date);
    const seconds = this.getSeconds(date);
    const milliseconds = this.getMilliseconds(date);

    // prints date & time in YYYY Mmm - DD HH:MM:SS,MS format
    return `${year} ${month} ${day} - ${hours}:${minutes}:${seconds},${milliseconds}`;
  },

  /**
   * @function getCaller - Get the filename and line number of the caller.
   *
   * @returns { string } - The filename and line number of the caller or
   * 'unknown' if the caller was not found.
   */
  getCaller() {
    const source = get()[5].getFileName();

    if (source) {
      const filename = path.basename(source);
      const line = get()[5].getLineNumber();
      return `${filename}:${line}`.padStart(25, ' ');
    }

    return 'unknown'.padStart(25, ' ');
  },
};
