import fs from 'fs';
import os from 'os';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { get } from 'stack-trace';
import cliSpinners from 'cli-spinners';

export default {
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
      text: message,
    }).start();

    const methodName = `${logType}ToFile`;
    this[methodName](message);

    return spinnerInstance;
  },

  debug(...debug) {
    this.debugToConsole(...debug);
    this.debugToFile(...debug);
  },
  info(...info) {
    this.infoToConsole(...info);
    this.infoToFile(...info);
  },
  warn(...warn) {
    this.warnToConsole(...warn);
    this.warnToFile(...warn);
  },
  error(...error) {
    this.errorToConsole(...error);
    this.errorToFile(...error);
  },

  debugToConsole(...debug) {
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.debug} |`, ...debug);
  },

  infoToConsole(...info) {
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.info} |`, ...info);
  },

  warnToConsole(...warn) {
    // eslint-disable-next-line no-console
    console.warn(`${this.prefixes.console.warn} |`, ...warn);
  },

  errorToConsole(...error) {
    const fatal = error.length > 1 ? error.splice(-1)[0] : false;
    // eslint-disable-next-line no-console
    console[fatal ? 'error' : 'log'](
      `${this.prefixes.console.error}`,
      ...error,
    );
  },

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

  debugToFile(...debug) {
    if (!process.env.APP_DEBUG) return;
    debug.forEach((debugData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.debug} | ${this.getCaller(
          true,
        )} | ${debugData}`,
      );
    });
  },

  infoToFile(...info) {
    if (!process.env.APP_DEBUG) return;
    info.forEach((infoData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.info} | ${this.getCaller(
          true,
        )} | ${infoData}`,
      );
    });
  },

  warnToFile(...warn) {
    if (!process.env.APP_DEBUG) return;
    warn.forEach((warnData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.warn} | ${this.getCaller(
          true,
        )} | ${warnData}`,
      );
    });
  },

  errorToFile(...error) {
    if (!process.env.APP_DEBUG) return;
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
    },
    file: {
      debug: '[DEBUG]',
      info: '[INFO] ',
      warn: '[WARN] ',
      error: '[ERROR]',
    },
  },

  getYear(date) {
    return date.getFullYear();
  },
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
  getDay(date) {
    return `0${date.getDate()}`.slice(-2);
  },
  getHours(date) {
    return `0${date.getHours()}`.slice(-2);
  },
  getMinutes(date) {
    return `0${date.getMinutes()}`.slice(-2);
  },
  getSeconds(date) {
    return `0${date.getSeconds()}`.slice(-2);
  },
  getMilliseconds(date) {
    return `00${date.getMilliseconds()}`.slice(-3);
  },

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
  getCaller(file = false) {
    const source = get()[file ? 5 : 3].getFileName();
    if (source) {
      const filename = path.basename(source);
      const line = get()[file ? 5 : 3].getLineNumber();
      return `${filename}:${line}`.padStart(25, ' ');
    }
    return 'unknown'.padStart(25, ' ');
  },
};
