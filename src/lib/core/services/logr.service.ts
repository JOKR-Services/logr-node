import '@infra/datadog';

import { TriggerInDTO } from '@core/dtos';
import { getErrorPattern, getLogPattern } from '@core/helpers';
import { Logger, LoggerService } from '@core/interfaces';
import { AsyncTraceStorage } from '@core/storages';
import { LoggerWinston } from '@infra/winston';

/** @implements {LoggerService} */
export class Logr implements LoggerService {
  private _trigger: TriggerInDTO;

  constructor(private readonly logger: Logger = new LoggerWinston()) {
    this._trigger = {};
  }

  public error(error: any, title: string, ...params: any[]): void {
    const errorPattern = getErrorPattern(error, this.trigger, ...params);
    const errorTitle = title.trim().length ? title.trim() : errorPattern.error.message;

    this.logger.error(errorPattern, errorTitle);
  }

  public info(message: string, ...params: any[]): void {
    const logPattern = getLogPattern(this.trigger, message, ...params);
    this.logger.info(logPattern);
  }

  public warn(message: string, ...params: any[]): void {
    const logPattern = getLogPattern(this.trigger, message, ...params);
    this.logger.warn(logPattern);
  }

  public get trigger(): TriggerInDTO {
    return {
      kind: this._trigger.kind,
      methodName: this._trigger.methodName,
      className: this._trigger.className ?? 'MissingClassName',
      causationId: AsyncTraceStorage.causationId,
      correlationId: AsyncTraceStorage.correlationId
    };
  }

  public set trigger(trigger: TriggerInDTO) {
    this._trigger = trigger;
  }
}
