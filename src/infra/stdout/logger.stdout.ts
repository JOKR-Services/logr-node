import { ILogger } from '@domain/interfaces';
import { ILoggerErrorPattern } from '@domain/interfaces';

export class LoggerStdout implements ILogger {
  public error(error: ILoggerErrorPattern): void {
    console.log(error);
  }
}
