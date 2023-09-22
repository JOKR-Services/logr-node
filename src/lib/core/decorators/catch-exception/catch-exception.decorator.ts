import { catchExceptionFactory } from '@core/factories';
import { getLogParams, persistsMetadata } from '@core/helpers';
import { LoggerService } from '@core/interfaces';
import { Logr } from '@core/services';
import { CatchExceptionOptions } from '@core/types';

/**
 * Decorator function that catches exceptions and logs them using a logger.
 *
 * @param {CatchExceptionOptions} [options] - The options for error handling (optional).
 * @param {LoggerService} [logger] - The logger instance to use for logging (optional).
 *                                    If not provided, a default logger instance will be used.
 * @returns {Function} - The decorated method with exception handling.
 */
export function CatchException(
  options?: CatchExceptionOptions,
  logger: LoggerService = Logr.getInstance()
) {
  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = descriptor.value;

    function setParams(args: any[]): void {
      logger.params = getLogParams(args, options);
    }

    function logError(this: any, error: any): void {
      logger.error(error, {
        kind: options?.kind || this.__kind,
        className: target.constructor.name,
        methodName: methodName
      });
    }

    const factory = catchExceptionFactory(method, { logError, setParams }, options);

    descriptor.value = options?.isSync ? factory.syncFn : factory.asyncFn;

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
