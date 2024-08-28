import { ErrorPatternDTO } from '@core/dtos';
import { LogPatternDTO } from '@core/dtos/patterns.dto';

/**
 * Represents a logger.
 *
 * @property {(error: ErrorPatternDTO) => void} error - Logs an error.
 * @property {(dto: LogPatternDTO) => void} info - Logs an info.
 * @property {(dto: LogPatternDTO) => void} warn - Logs a warning.
 * @property {(dto: LogPatternDTO) => void} debug - Logs a debug.
 */
export interface Logger {
  /**
   * Logs an error.
   *
   * @param {ErrorPatternDTO} err - The error pattern to be logged.
   * @returns {void}
   */
  error(err: ErrorPatternDTO, errorTitle: string): void;

  /**
   * Logs an info.
   *
   * @param {LogPatternDTO} dto - The log pattern to be logged.
   * @returns {void}
   */
  info(dto: LogPatternDTO): void;

  /**
   * Logs an warn.
   *
   * @param {LogPatternDTO} dto - The log pattern to be logged.
   * @returns {void}
   */
  warn(dto: LogPatternDTO): void;

  /**
   * Logs a debug.
   *
   * @param {LogPatternDTO} dto - The log pattern to be logged.
   * @returns {void}
   */
  debug(dto: LogPatternDTO): void;
}
