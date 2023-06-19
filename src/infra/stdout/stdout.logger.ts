import { ILogger } from '../../domain/interfaces';
import { ILoggerErrorPattern } from '../../domain/interfaces/logger-error-pattern.interface';

export class StdoutLogger implements ILogger {
  public error(error: ILoggerErrorPattern): void {
    console.log(error);
  }
}
