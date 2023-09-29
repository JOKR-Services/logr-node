import { ErrorDTO } from '@core/dtos/error.dto';
import { TriggerOutDTO } from '@core/dtos/trigger.dto';

/**
 * Represents an error pattern for logging.
 *
 * @property {TriggerOutDTO} logger - The logger trigger associated with the error pattern.
 * @property {ErrorDTO} error - The error information related to the pattern.
 */
export type ErrorPatternDTO = {
  /**
   * The timestamp when the error pattern was generated.
   *
   * @type {string}
   * @remarks This field represents the date and time when the error pattern was created, typically in ISO 8601 format.
   */
  timestamp: string;

  /**
   * The logger trigger associated with the error pattern.
   *
   * @type {TriggerOutDTO}
   */
  logger: TriggerOutDTO;

  /**
   * The error information related to the pattern.
   *
   * @type {ErrorDTO}
   */
  error: ErrorDTO;
};
