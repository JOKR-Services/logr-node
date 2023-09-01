/**
 * Represents the caller information for a logging event.
 *
 * @property {string} className - The name of the class where the logging event occurred.
 * @property {string} methodName - The name of the method where the logging event occurred.
 * @property {string} kind - The kind of logging event (e.g., 'Application', 'Domain', 'Infra').
 */

export interface LoggerCaller {
  /**
   * The name of the class where the logging event occurred.
   *
   * @type {string}
   */
  className: string;

  /**
   * The name of the method where the logging event occurred.
   *
   * @type {string}
   */
  methodName: string;

  /**
   * The kind of logging event (e.g., 'Application', 'Domain', 'Infra').
   *
   * @type {string}
   */
  kind: string;
}

/**
 * Represents information about an error.
 *
 * @property {string} stack - The error stack trace.
 * @property {string} name - The name of the error.
 * @property {string} message - The error message.
 * @property {string} kind - The kind of error (e.g., 'Application', 'Domain', 'Infra').
 */
export interface IErrorInfo {
  /**
   * The error stack trace.
   *
   * @type {string}
   */
  stack: string;

  /**
   * The name of the error.
   *
   * @type {string}
   */
  name: string;

  /**
   * The error message.
   *
   * @type {string}
   */
  message: string;

  /**
   * The kind of error (e.g., 'Application', 'Domain', 'Infra').
   *
   * @type {string}
   */
  kind: string;
}

/**
 * Represents a trigger for a logging operation.
 *
 * @property {string} name - The name of the class where the logging event occurred.
 * @property {string} method_name - The name of the method where the logging event occurred.
 * @property {unknown} params - The parameters of the trigger (type unknown).
 */
export interface ILoggerTrigger {
  /**
   * The name of the class where the logging event occurred.
   *
   * @type {string}
   */
  name: string;

  /**
   * The name of the method where the logging event occurred.
   *
   * @type {string}
   */
  method_name: string;

  /**
   * The parameters of the trigger (type unknown).
   *
   * @type {unknown}
   */
  params: unknown;
}

/**
 * Represents an error pattern for logging.
 *
 * @property {ILoggerTrigger} logger - The logger trigger associated with the error pattern.
 * @property {IErrorInfo} error - The error information related to the pattern.
 */
export interface ILoggerErrorPattern {
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
   * @type {ILoggerTrigger}
   */
  logger: ILoggerTrigger;

  /**
   * The error information related to the pattern.
   *
   * @type {IErrorInfo}
   */
  error: IErrorInfo;
}

/**
 * Represents a logger service.
 *
 * @property {(err: unknown, caller: LoggerCaller, ...params: unknown[]) => void} error - Logs an error.
 */
export interface ILoggerService {
  /**
   * Logs an error.
   *
   * @param {unknown} err - The error object to be logged.
   * @param {LoggerCaller} [caller] - The caller information for the logging event.
   * @param {unknown[]} [params] - Additional parameters associated with the error (optional).
   * @returns {void}
   */
  error(err: unknown, caller: LoggerCaller, ...params: unknown[]): void;
}

/**
 * Represents a logger.
 *
 * @property {(error: ILoggerErrorPattern) => void} error - Logs an error.
 */
export interface ILogger {
  /**
   * Logs an error.
   *
   * @param {ILoggerErrorPattern} err - The error pattern to be logged.
   * @returns {void}
   */
  error: (error: ILoggerErrorPattern) => void;
}
