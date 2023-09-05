import { persistsMetadata } from '@domain/helpers';
import { ILoggerService } from '@domain/interfaces';
import { Logr } from '@domain/logr';

/**
 * Represents the options for a logger.
 *
 * @property {string} [kind] - The kind of logging event (e.g., 'Application', 'Domain', 'Infra') (optional).
 * @property {boolean} [bubbleException] - Flag indicating whether the exception should bubble up (optional).
 * @property {Function} [onException] - Callback function for handling exceptions (optional).
 *                                      Receives the exception and the context as parameters and returns an unknown value.
 *                                      The exception parameter has a generic type 'Exception', which defaults to 'Error'.
 *                                      The context parameter can be of any type.
 */
type Options = {
  /**
   * Flag indicating whether the exception should bubble up (optional).
   *
   * @type {boolean}
   */
  bubbleException?: boolean;

  /**
   * Custom error instance to be thrown or returned when handling exceptions (optional).
   * If provided, this error instance will be thrown or returned instead of the original error.
   *
   * @type {any}
   */
  customErrorInstance?: any;

  /**
   * The kind of logging event (e.g., 'Application', 'Domain', 'Infra') (optional).
   *
   * @type {string}
   */
  kind?: string;

  /**
   * Flag indicating whether the method is synchronous (optional).
   *
   * @type {boolean}
   */
  isSync?: boolean;

  /**
   * Callback function for handling exceptions (optional).
   *
   * @type {Function}
   * @param {Exception = InstanceType<typeof Error>} exception - The exception object.
   * @param {any} context - The context associated with the exception.
   * @returns {unknown | Promise<unknown>} - The return value of the callback function.
   * @template Exception - The generic type of the exception, defaults to 'Error'.
   */
  onException?<Exception = InstanceType<typeof Error>>(exception: Exception, context: any): unknown;
};

/**
 * Decorator function that catches exceptions and logs them using a logger.
 *
 * @param {Options} [options] - The options for error handling (optional).
 * @param {ILoggerService} [logger] - The logger instance to use for logging (optional).
 *                                    If not provided, a default logger instance will be used.
 * @returns {Function} - The decorated method with exception handling.
 */
export function CatchException(options?: Options, logger: ILoggerService = new Logr()) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = descriptor.value;

    if (!options?.isSync) {
      descriptor.value = async function (...args: any[]) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          logger.error(
            error,
            {
              kind: options?.kind || (this as any).__kind,
              className: target.constructor.name,
              methodName: propertyKey
            },
            ...args
          );

          if (options?.onException) {
            options.onException.call(this, error, this);
          }

          if (options?.customErrorInstance || options?.bubbleException) {
            throw options?.customErrorInstance || error;
          }
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        try {
          return method.apply(this, args);
        } catch (err) {
          logger.error(
            err,
            {
              kind: options?.kind || (this as any).__kind,
              className: target.constructor.name,
              methodName: propertyKey
            },
            ...args
          );

          if (options?.onException) {
            options.onException.call(this, err, this);
          }

          if (options?.customErrorInstance || options?.bubbleException) {
            throw options?.customErrorInstance || err;
          }
        }
      };
    }

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
