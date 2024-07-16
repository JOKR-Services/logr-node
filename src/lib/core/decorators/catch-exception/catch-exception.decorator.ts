import { catchExceptionFactory } from '@core/factories';
import { getLogParams, persistsMetadata } from '@core/helpers';
import { LoggerService } from '@core/interfaces';
import { Logr } from '@core/services';
import { AsyncTraceStorage } from '@core/storages';
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
  logger: LoggerService = new Logr()
) {
  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = descriptor.value;

    function logError(this: any, error: any, title: string, args: any[]): void {
      const params = getLogParams(args, options);

      logger.trigger = {
        kind: options?.kind || this.__kind,
        className: target.constructor.name,
        methodName: methodName
      };

      if (options?.typeErrorHandling === 'REGISTER') {
        if (!AsyncTraceStorage.outsideAsyncContext) {
          AsyncTraceStorage.setRegisteredError(
            error,
            {
              kind: options?.kind || this.__kind,
              className: target.constructor.name,
              methodName: methodName
            },
            title,
            ...params
          );

          return;
        }
      }

      logger.error(error, title, ...params);

      AsyncTraceStorage.clearRegisteredError();
    }

    const factory = catchExceptionFactory(method, logError, options);

    descriptor.value = options?.isSync ? factory.syncFn : factory.asyncFn;

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
