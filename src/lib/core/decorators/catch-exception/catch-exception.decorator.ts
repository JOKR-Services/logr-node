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

    function registerError(this: any, error: any, args: any[]): void {
      const params = getLogParams(args, options);
      logger.registerError(
        error,
        {
          kind: options?.kind || this.__kind,
          className: target.constructor.name,
          methodName: methodName
        },
        params
      );
    }
    function logError(this: any, error: any, args: any[]): void {
      const params = getLogParams(args, options);
      if (logger.registeredError.isRegistered) {
        logger.error(
          logger.registeredError.value.error,
          logger.registeredError.value.trigger,
          ...logger.registeredError.value.params
        );

        logger.clearErrorRegister();

        return;
      }

      logger.error(
        error,
        {
          kind: options?.kind || this.__kind,
          className: target.constructor.name,
          methodName: methodName
        },
        ...params
      );
    }

    const factory = catchExceptionFactory(method, { logError, registerError }, options);

    descriptor.value = options?.isSync ? factory.syncFn : factory.asyncFn;

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
