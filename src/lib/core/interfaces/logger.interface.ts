import { ErrorPatternDTO } from '@core/dtos';

/**
 * Represents a logger.
 *
 * @property {(error: ErrorPatternDTO) => void} error - Logs an error.
 */
export interface Logger {
  /**
   * Logs an error.
   *
   * @param {ErrorPatternDTO} err - The error pattern to be logged.
   * @returns {void}
   */
  error(err: ErrorPatternDTO): void;
}
