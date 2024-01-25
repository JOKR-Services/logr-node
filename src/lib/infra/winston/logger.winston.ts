import 'dotenv/config';

import { ErrorPatternDTO, LogPatternDTO } from '@core/dtos';
import { Logger } from '@core/interfaces';
import winston from 'winston';

/** @implements {Logger} */
export class LoggerWinston implements Logger {
  private winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger({
      levels: winston.config.npm.levels,
      transports: [new winston.transports.Console(this.consoleOptions)],
      exitOnError: false
    });
  }

  public error(errorPattern: ErrorPatternDTO, errorTitle: string): void {
    this.winston.error(errorTitle, errorPattern);
  }

  public info(dto: LogPatternDTO): void {
    this.winston.info(dto);
  }

  public warn(dto: LogPatternDTO): void {
    this.winston.warn(dto);
  }

  private get consoleOptions() {
    return {
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true
    };
  }
}
