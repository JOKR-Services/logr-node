import '@infra/datadog';

import { RegisteredErrorDTO, TriggerInDTO } from '@core/dtos';
import { getErrorPattern, getLogPattern } from '@core/helpers';
import { Logger, LoggerService } from '@core/interfaces';
import { LoggerWinston } from '@infra/winston';

/** @implements {LoggerService} */
export class Logr implements LoggerService {
  private static instance: LoggerService;
  private loggerRegisteredError: RegisteredErrorDTO = {
    isRegistered: false
  };

  private constructor(private readonly logger: Logger) {}

  public static getInstance(logger: Logger = new LoggerWinston()): LoggerService {
    if (!this.instance) {
      this.instance = new Logr(logger);
    }

    return this.instance;
  }

  public get registeredError(): RegisteredErrorDTO {
    return this.loggerRegisteredError;
  }

  public registerError(error: any, trigger: TriggerInDTO, title: string, params: any[]): void {
    if (this.loggerRegisteredError.isRegistered) return;

    this.loggerRegisteredError = {
      isRegistered: true,
      value: {
        error,
        trigger,
        params,
        title
      }
    };
  }

  public clearErrorRegister(): void {
    this.loggerRegisteredError = {
      isRegistered: false
    };
  }

  public error(error: any, trigger: TriggerInDTO, title: string, ...params: any[]): void {
    const errorPattern = getErrorPattern(error, trigger, ...params);
    const errorTitle = title.trim().length ? title.trim() : errorPattern.error.message;

    this.logger.error(errorPattern, errorTitle);
  }

  public info(trigger: TriggerInDTO, message: string, ...params: any[]): void {
    const logPattern = getLogPattern(trigger, message, ...params);
    this.logger.info(logPattern);
  }

  public warn(trigger: TriggerInDTO, message: string, ...params: any[]): void {
    const logPattern = getLogPattern(trigger, message, ...params);
    this.logger.warn(logPattern);
  }
}
