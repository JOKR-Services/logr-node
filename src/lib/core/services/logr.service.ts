import '@infra/datadog';

import { RegisteredErrorDTO, TriggerInDTO } from '@core/dtos';
import { getErrorPattern } from '@core/helpers';
import { Logger, LoggerService } from '@core/interfaces';
import { LoggerStdout } from '@infra/stdout';

/** @implements {LoggerService} */
export class Logr implements LoggerService {
  private static instance: LoggerService;
  private loggerRegisteredError: RegisteredErrorDTO = {
    isRegistered: false
  };

  private constructor(private readonly logger: Logger) {}

  public static getInstance(logger: Logger = new LoggerStdout()): LoggerService {
    if (!this.instance) {
      this.instance = new Logr(logger);
    }

    return this.instance;
  }

  public get registeredError(): RegisteredErrorDTO {
    return this.loggerRegisteredError;
  }

  public registerError(error: any, trigger: TriggerInDTO, params: any[]): void {
    if (this.loggerRegisteredError.isRegistered) return;

    this.loggerRegisteredError = {
      isRegistered: true,
      value: {
        error,
        trigger,
        params
      }
    };
  }

  public clearErrorRegister(): void {
    this.loggerRegisteredError = {
      isRegistered: false
    };
  }

  public error(error: any, trigger: TriggerInDTO, ...params: any[]): void {
    this.logger.error(getErrorPattern(error, trigger, ...params));
  }
}
