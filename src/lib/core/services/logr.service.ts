import '@infra/datadog';

import { TriggerInDTO } from '@core/dtos';
import { getErrorPattern } from '@core/helpers';
import { Logger, LoggerService } from '@core/interfaces';
import { LoggerStdout } from '@infra/stdout';

/** @implements {LoggerService} */
export class Logr implements LoggerService {
  private static instance: LoggerService;
  private loggerErrParams: any[] = [];

  private constructor(private readonly logger: Logger) {}

  public static getInstance(logger: Logger = new LoggerStdout()): LoggerService {
    if (!this.instance) {
      this.instance = new Logr(logger);
    }

    return this.instance;
  }

  public get params(): any[] {
    return this.loggerErrParams;
  }

  public set params(params: any[]) {
    this.loggerErrParams = params;
  }

  public error(error: any, trigger: TriggerInDTO, ...params: any[]): void {
    if (!params.length) return this.logger.error(getErrorPattern(error, trigger, ...this.params));

    this.logger.error(getErrorPattern(error, trigger, ...params));
  }
}
