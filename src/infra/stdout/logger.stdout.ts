import { ILogger } from '@domain/interfaces';
import { ILoggerErrorPattern } from '@domain/interfaces';

/** @implements {ILogger} */
export class LoggerStdout implements ILogger {
  public error(error: ILoggerErrorPattern): void {
    process.stderr.write(JSON.stringify(error, null, 2));
  }
}
