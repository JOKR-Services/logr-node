/**
 * @description Represents the options for catch exception.
 *
 * @property {boolean} [bubbleException] - Flag indicating whether the exception should bubble up (optional).
 * @property {any} [customErrorInstance] - If provided, this error instance will be thrown or returned instead of the original error (optional).
 * @property {string} [kind] - The kind of logging event (e.g., 'Application', 'Domain', 'Infra') (optional).
 * @property {boolean} [isSync] - A flag that defines whether the method is synchronous (optional)
 * @property {Function} [onException] - Callback function for handling exceptions (optional).
 *                                      Receives the exception and the context as parameters.
 *                                      The exception parameter has a generic type 'Exception', which defaults to 'Error'.
 *                                      The context parameter can be of any type.
 *
 * @property {Function} [returnOnException] - Callback function for handling exceptions and returns an unknown value (optional).
 *                                      Receives the exception and the context as parameters and returns an unknown value.
 *                                      The exception parameter has a generic type 'Exception', which defaults to 'Error'.
 *                                      The context parameter can be of any type.
 *
 */
export type CatchExceptionOptions = {
  /**
   * @description Flag indicating whether the exception should bubble up (optional).
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {boolean}
   */
  bubbleException?: boolean;

  /**
   * @description If provided, this error instance will be thrown or returned instead of the original error.
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {any}
   */
  customErrorInstance?: any;

  /**
   * @description The kind of logging event (e.g., 'Application', 'Domain', 'Infra') (optional).
   *
   * @type {string}
   */
  kind?: string;

  /**
   * @description Flag indicating whether the method is synchronous (optional).
   *
   * @type {boolean}
   */
  isSync?: boolean;

  /**
   * @description Callback function for handling exceptions (optional).
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {Function}
   * @param {Exception = InstanceType<typeof Error>} exception - The exception object.
   * @param {any} context - The context associated with the exception.
   * @returns {void | Promise<void>} - The return value of the callback function.
   * @template Exception - The generic type of the exception, defaults to 'Error'.
   */
  onException?<Exception = InstanceType<typeof Error>>(
    exception: Exception,
    context: any
  ): void | Promise<void>;

  /**
   * @description Callback function for handling exceptions and returns an unknown value (optional).
   *
   * @overview if provided, the "bubbleException", "customErrorInstance" and "onException" options will be invalidated
   *
   * @type {Function}
   * @param {Exception = InstanceType<typeof Error>} exception - The exception object.
   * @param {any} context - The context associated with the exception.
   * @returns {unknown | Promise<unknown>} - The return value of the callback function.
   * @template Exception - The generic type of the exception, defaults to 'Error'.
   */
  returnOnException?<Exception = InstanceType<typeof Error>>(
    exception: Exception,
    context: any
  ): unknown | Promise<unknown>;
};
