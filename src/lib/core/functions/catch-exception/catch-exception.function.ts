import { catchExceptionFactory } from '@core/factories';
import { getLogParams } from '@core/helpers';
import { Logr } from '@core/services';
import { AsyncTraceStorage } from '@core/storages';
import { CatchExceptionOptions } from '@core/types';

export function catchException<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: CatchExceptionOptions,
  logger = Logr.getInstance()
): Fn {
  function logError(this: any, error: any, title: string, args: any[]): void {
    const params = getLogParams(args, options);

    if (options?.typeErrorHandling === 'REGISTER') {
      if (!AsyncTraceStorage.outsideAsyncContext) {
        AsyncTraceStorage.setRegisteredError(
          error,
          {
            kind: options?.kind || this.__kind,
            className: (fn as any).name || 'Anonymous'
          },
          title,
          ...params
        );

        return;
      }
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

    AsyncTraceStorage.clearRegisteredError();
  }

  const factory = catchExceptionFactory(fn, logError, options);

  return options?.isSync ? (factory.syncFn as Fn) : (factory.asyncFn as Fn);
}
