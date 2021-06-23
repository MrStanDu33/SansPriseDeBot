import fs from 'fs';
import os from 'os';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { get } from 'stack-trace';
import cliSpinners from 'cli-spinners';

/* eslint-disable no-console */

export default {
  loader(spinnerSettings, message, logType) {
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

    this.debugToFile(message);

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
  infoToConsole(...info) {
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.info} |`, ...info);
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
  warnToConsole(...warn) {
    // eslint-disable-next-line no-console
    console.log(`${this.prefixes.console.warn} |`, ...warn);
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
  errorToConsole(...error) {
    const fatal = error.length > 1 ? error.splice(-1)[0] : false;
    // eslint-disable-next-line no-console
    console[fatal ? 'error' : 'log'](
      `${this.prefixes.console.error}`,
      ...error,
    );
  },
  errorToFile(...error) {
    if (!process.env.APP_DEBUG) return;
    error.forEach((errorData) => {
      this.writeToLogFile(
        `${this.getDateTime()} | ${this.prefixes.file.error} | ${this.getCaller(
          true,
        )} | ${errorData}`,
      );
    });
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

  getDateTime() {
    const dateObj = new Date();

    const year = dateObj.getFullYear();
    const month = [
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
    ][dateObj.getMonth()];
    const day = `0${dateObj.getDate()}`.slice(-2);

    const hours = `0${dateObj.getHours()}`.slice(-2);
    const minutes = `0${dateObj.getMinutes()}`.slice(-2);
    const seconds = `0${dateObj.getSeconds()}`.slice(-2);
    const milliseconds = `00${dateObj.getMilliseconds()}`.slice(-3);

    // prints date & time in YYYY Mmm - DD HH:MM:SS,MS format
    return `${year} ${month} ${day} - ${hours}:${minutes}:${seconds},${milliseconds}`;
  },
  getCaller(file = false) {
    const filename = path.basename(get()[file ? 5 : 3].getFileName());
    const line = get()[1].getLineNumber();
    return `${filename}:${line}`;
  },
};
