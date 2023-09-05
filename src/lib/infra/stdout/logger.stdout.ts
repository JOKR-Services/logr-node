import { ILogger } from '@domain/interfaces';
import { ILoggerErrorPattern } from '@domain/interfaces';

/** @implements {ILogger} */
export class LoggerStdout implements ILogger {
  public error(error: ILoggerErrorPattern): void {
    console.error(`${JSON.stringify(error)}`);
  }
}
