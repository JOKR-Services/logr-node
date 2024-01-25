import { ErrorDTO } from '@core/dtos/error.dto';
import { TriggerOutDTO } from '@core/dtos/trigger.dto';

/**
 * Represents an log pattern for logging.
 *
 * @property {TriggerOutDTO} logger - The logger trigger associated with the log pattern.
 */
export type LogPatternDTO = {
  /**
   * The timestamp when the log was generated.
   *
   * @type {string}
   * @remarks This field represents the date and time when log was created, typically in ISO 8601 format.
   */
  timestamp: string;

  /**
   * The logger trigger associated with.
   *
   * @type {TriggerOutDTO}
   */
  logger: TriggerOutDTO;

  /**
   * The message associated with.
   *
   * @type {TriggerOutDTO}
   */
  message?: string;
};

/**
 * Represents an error pattern for logging.
 *
 * @property {TriggerOutDTO} logger - The logger trigger associated with the error pattern.
 * @property {ErrorDTO} error - The error information related to the pattern.
 */
export interface ErrorPatternDTO extends LogPatternDTO {
  /**
   * The error information related to the pattern.
   *
   * @type {ErrorDTO}
   */
  error: ErrorDTO;
}
