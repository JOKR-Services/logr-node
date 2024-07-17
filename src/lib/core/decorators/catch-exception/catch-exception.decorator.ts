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

      if (AsyncTraceStorage.outsideAsyncContext) {
        logger.error(error, title, ...params);
        return;
      }

      if (options?.typeErrorHandling === 'REGISTER') {
        AsyncTraceStorage.registeredError = { error, trigger: logger.trigger, title, params };

        return;
      }

      if (AsyncTraceStorage.registeredError) {
        logger.trigger = AsyncTraceStorage.registeredError.trigger;
      }

      logger.error(
        AsyncTraceStorage.registeredError?.error ?? error,
        AsyncTraceStorage.registeredError?.title ?? title,
        ...(AsyncTraceStorage.registeredError?.params ?? params)
      );

      AsyncTraceStorage.clearRegisteredError();
    }

    const factory = catchExceptionFactory(method, logError, options);

    descriptor.value = options?.isSync ? factory.syncFn : factory.asyncFn;

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
