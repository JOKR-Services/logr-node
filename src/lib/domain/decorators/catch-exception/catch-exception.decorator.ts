import { CatchExceptionOptions } from '@domain/decorators/catch-exception/catch-exception.types';
import { persistsMetadata } from '@domain/helpers';
import { ILoggerService } from '@domain/interfaces';
import { Logr } from '@domain/logr';

/**
 * Decorator function that catches exceptions and logs them using a logger.
 *
 * @param {Options} [options] - The options for error handling (optional).
 * @param {ILoggerService} [logger] - The logger instance to use for logging (optional).
 *                                    If not provided, a default logger instance will be used.
 * @returns {Function} - The decorated method with exception handling.
 */
export function CatchException(
  options?: CatchExceptionOptions,
  logger: ILoggerService = new Logr()
) {
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
        } catch (asyncErr) {
          logger.error(
            asyncErr,
            {
              kind: options?.kind || (this as any).__kind,
              className: target.constructor.name,
              methodName: propertyKey
            },
            ...args
          );

          if (options?.returnOnException) {
            return await options?.returnOnException.call(this, asyncErr, this);
          }

          if (options?.onException) {
            await options.onException.call(this, asyncErr, this);
          }

          if (options?.customErrorInstance || options?.bubbleException) {
            throw options?.customErrorInstance || asyncErr;
          }
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        try {
          return method.apply(this, args);
        } catch (syncErr) {
          logger.error(
            syncErr,
            {
              kind: options?.kind || (this as any).__kind,
              className: target.constructor.name,
              methodName: propertyKey
            },
            ...args
          );

          if (options?.returnOnException) {
            return options?.returnOnException.call(this, syncErr, this);
          }

          if (options?.onException) {
            options.onException.call(this, syncErr, this);
          }

          if (options?.customErrorInstance || options?.bubbleException) {
            throw options?.customErrorInstance || syncErr;
          }
        }
      };
    }

    persistsMetadata(descriptor.value, method);

    return descriptor;
  };
}
