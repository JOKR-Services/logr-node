import { catchExceptionFactory } from '@core/factories';
import { getLogParams } from '@core/helpers';
import { Logr } from '@core/services';
import { AsyncTraceStorage } from '@core/storages';
import { CatchExceptionOptions } from '@core/types';

export function catchException<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: CatchExceptionOptions,
  logger = new Logr()
): Fn {
  function logError(this: any, error: any, title: string, args: any[]): void {
    const params = getLogParams(args, options);

    logger.trigger = {
      kind: options?.kind || this.__kind,
      className: (fn as any).name || 'Anonymous'
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

  const factory = catchExceptionFactory(fn, logError, options);

  return options?.isSync ? (factory.syncFn as Fn) : (factory.asyncFn as Fn);
}
