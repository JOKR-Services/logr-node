import { ILogger, ILoggerService, LoggerCaller } from '@domain/interfaces';
import { getErrorPattern } from '@domain/logr/helpers';
import { LoggerStdout } from '@infra/stdout';

/** @implements {ILoggerService} */
export class Logr implements ILoggerService {
  constructor(private readonly logger: ILogger = new LoggerStdout()) {}

  public error(err: unknown, caller: LoggerCaller, ...params: unknown[]): void {
    this.logger.error(getErrorPattern(err, caller, ...params));
  }
}
