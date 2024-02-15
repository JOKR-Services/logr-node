import 'dotenv/config';

import { ErrorPatternDTO, LogPatternDTO } from '@core/dtos';
import { Logger } from '@core/interfaces';
import winston from 'winston';

/** @implements {Logger} */
export class LoggerWinston implements Logger {
  private static _winston?: winston.Logger;

  private static get winston(): winston.Logger {
    if (!this._winston) {
      this._winston = winston.createLogger({
        levels: winston.config.npm.levels,
        transports: [new winston.transports.Console(this.consoleOptions)],
        exitOnError: false
      });
    }
    return this._winston;
  }

  private static get consoleOptions() {
    return {
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true
    };
  }

  public error(errorPattern: ErrorPatternDTO, errorTitle: string): void {
    LoggerWinston.winston.error(errorTitle, errorPattern);
  }

  public info(dto: LogPatternDTO): void {
    LoggerWinston.winston.info(dto);
  }

  public warn(dto: LogPatternDTO): void {
    LoggerWinston.winston.warn(dto);
  }
}
