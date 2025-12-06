import { TriggerInDTO } from '@core/dtos/trigger.dto';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type RegisteredErrorDTO = {
  /**
   * The catched exception.
   */
  error: any;
  /**
   * Represents the caller information for a logging event.
   *
   * @type {TriggerInDTO}
   */
  trigger: TriggerInDTO;

  /**
   * The parameters of the trigger.
   *
   * @type {any[]}
   */
  params: any[];

  title: string;

  /**
   * The log level to use when logging the error.
   *
   * @type {LogLevel}
   */
  level: LogLevel;
};
