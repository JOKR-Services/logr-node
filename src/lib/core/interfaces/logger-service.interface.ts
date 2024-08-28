import { TriggerInDTO } from '@core/dtos';

/**
 * Represents a logger service.
 *
 * @property {(error: any, ...params: any[]) => void} error - Logs an error.
 */
export interface LoggerService {
  /**
   * Logs an error.
   *
   * @param {any} error - The error object to be logged.
   * @param {any[]} [params] - Additional parameters associated with the error (optional).
   * @returns {void}
   */
  error(error: any, title: string, ...params: any[]): void;

  /**
   * Logs an info.
   *
   * @param {any[]} [params] - Additional parameters associated with the log (optional).
   * @returns {void}
   */
  info(title: string, ...params: any[]): void;

  /**
   * Logs a warning.
   *
   * @param {any[]} [params] - Additional parameters associated with the log (optional).
   * @returns {void}
   */
  warn(title: string, ...params: any[]): void;

  /**
   * Logs a debug.
   *
   * @param {any[]} [params] - Additional parameters associated with the log (optional).
   * @returns {void}
   */
  debug(title: string, ...params: any[]): void;

  set trigger(trigger: TriggerInDTO);
}
