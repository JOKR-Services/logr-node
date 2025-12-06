import { LogLevel } from '@core/dtos';
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
        kind: options?.kind || this?.__kind,
        className: target.constructor.name,
        methodName: methodName
      };

      const level: LogLevel =
        typeof options?.level === 'function'
          ? options.level.call(this, error, this, ...args)
          : options?.level || 'error';

      if (AsyncTraceStorage.outsideAsyncContext) {
        logWithLevel(logger, level, error, title, params);
        return;
      }

      if (options?.typeErrorHandling === 'REGISTER') {
        AsyncTraceStorage.registeredError = {
          error,
          trigger: logger.trigger,
          title,
          params,
          level
        };

        return;
      }

      if (AsyncTraceStorage.registeredError) {
        logger.trigger = AsyncTraceStorage.registeredError.trigger;
      }

      const finalLevel = AsyncTraceStorage.registeredError?.level ?? level;
      const finalError = AsyncTraceStorage.registeredError?.error ?? error;
      const finalTitle = AsyncTraceStorage.registeredError?.title ?? title;
      const finalParams = AsyncTraceStorage.registeredError?.params ?? params;

      logWithLevel(logger, finalLevel, finalError, finalTitle, finalParams);

      AsyncTraceStorage.clearRegisteredError();
    }

    const factory = catchExceptionFactory(method, logError, options);

    descriptor.value = options?.isSync ? factory.syncFn : factory.asyncFn;

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}

function logWithLevel(
  logger: LoggerService,
  level: LogLevel,
  error: any,
  title: string,
  params: any[]
): void {
  switch (level) {
    case 'warn':
      logger.warn(title || error.message, error, ...params);
      break;
    case 'info':
      logger.info(title || error.message, error, ...params);
      break;
    case 'debug':
      logger.debug(title || error.message, error, ...params);
      break;
    case 'error':
    default:
      logger.error(error, title, ...params);
      break;
  }
}
