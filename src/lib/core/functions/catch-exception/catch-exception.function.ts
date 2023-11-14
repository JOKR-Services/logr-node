import { catchExceptionFactory } from '@core/factories';
import { getLogParams } from '@core/helpers';
import { Logr } from '@core/services';
import { CatchExceptionOptions } from '@core/types';

export function catchException<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: CatchExceptionOptions,
  logger = Logr.getInstance()
): Fn {
  function registerError(this: any, error: any, title: string, args: any[]): void {
    const params = getLogParams(args, options);
    logger.registerError(
      error,
      {
        kind: options?.kind || this.__kind,
        className: (fn as any).name || 'Anonymous'
      },
      title,
      params
    );
  }

  function logError(this: any, error: any, title: string, args: any[]): void {
    const params = getLogParams(args, options);

    if (logger.registeredError.isRegistered) {
      logger.error(
        logger.registeredError.value.error,
        logger.registeredError.value.trigger,
        logger.registeredError.value.title,
        ...logger.registeredError.value.params
      );

      logger.clearErrorRegister();

      return;
    }

    logger.error(
      error,
      {
        kind: options?.kind || this.__kind,
        className: (fn as any).name || 'Anonymous'
      },
      title,
      ...params
    );
  }

  const factory = catchExceptionFactory(fn, { logError, registerError }, options);

  return options?.isSync ? (factory.syncFn as Fn) : (factory.asyncFn as Fn);
}
