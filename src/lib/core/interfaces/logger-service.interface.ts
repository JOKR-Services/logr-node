import { RegisteredErrorDTO, TriggerInDTO } from '@core/dtos';

/**
 * Represents a logger service.
 *
 * @property {(error: any, trigger: TriggerInDTO, ...params: any[]) => void} error - Logs an error.
 */
export interface LoggerService {
  get registeredError(): RegisteredErrorDTO;

  registerError(error: any, trigger: TriggerInDTO, title: string, params: any[]): void;
  clearErrorRegister(): void;

  /**
   * Logs an error.
   *
   * @param {any} error - The error object to be logged.
   * @param {TriggerInDTO} [trigger] - The caller information for the logging event.
   * @param {any[]} [params] - Additional parameters associated with the error (optional).
   * @returns {void}
   */
  error(error: any, trigger: TriggerInDTO, title: string, ...params: any[]): void;

  /**
   * Logs an info.
   *
   * @param {TriggerInDTO} [trigger] - The caller information for the logging event.
   * @param {any[]} [params] - Additional parameters associated with the log (optional).
   * @returns {void}
   */
  info(trigger: TriggerInDTO, title: string, ...params: any[]): void;

  /**
   * Logs a warning.
   *
   * @param {TriggerInDTO} [trigger] - The caller information for the logging event.
   * @param {any[]} [params] - Additional parameters associated with the log (optional).
   * @returns {void}
   */
  warn(trigger: TriggerInDTO, title: string, ...params: any[]): void;
}
