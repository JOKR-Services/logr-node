import { CommonOptions } from '@core/types/common-options.types';

export type CatchExceptionOptions = CommonOptions & {
  /**
   * @description Allows you to specify a custom error instance to be thrown, useful for customizing the exception that is logged. (optional).
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {any or function}
   */
  customErrorInstance?: any | ((exception: any, context?: any, ...params: any[]) => any);

  /**
   * @description If set to true, the original exception will be thrown after logging, allowing the exception to continue its propagation. (optional).
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {boolean}
   */
  bubbleException?: boolean;

  /**
   * @description It offers the ability to provide a custom function to handle the logged exception and return new information or values after the exception has been logged. (optional).
   *
   * @overview if provided, the "bubbleException", "customErrorInstance" and "onException" options will be invalidated
   *
   * @type {Function}
   * @param {any} exception - The exception object.
   * @param {any} context - The context associated with the exception.
   * @param {any[]} ...params = All parameters in the same order as they were declared in method or function
   * @returns {any | Promise<any>} - The new information to be returned.
   */
  returnOnException?: (exception: any, context?: any, ...params: any[]) => any | Promise<any>;

  /**
   * @description It allows you to provide a custom function to handle the registered exception, executing specific actions when an exception occurs. (optional).
   *
   * @overview does not work if "returnOnException" is provided
   *
   * @type {Function}
   * @param {any} exception - The exception object.
   * @param {any} context - The context associated with the exception.
   * @param {any[]} ...params = All parameters in the same order as they were declared in method or function
   * @returns {void | Promise<void>}
   */
  onException?: (exception: any, context?: any, ...params: any[]) => void | Promise<void>;

  /**
   * @description If set to LOG, the exception will be logged. If set to REGISTER, the exception will be logged in the service to be logged in higher layers. (optional).
   *
   * @type {"LOG"|"REGISTER"}
   */
  typeErrorHandling?: 'LOG' | 'REGISTER';
};
