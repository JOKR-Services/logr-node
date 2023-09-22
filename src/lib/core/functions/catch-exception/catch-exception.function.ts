import { catchExceptionFactory } from '@core/factories';
import { getLogParams } from '@core/helpers';
import { Logr } from '@core/services';
import { CatchExceptionOptions } from '@core/types';

export function catchException<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: CatchExceptionOptions,
  logger = Logr.getInstance()
): Fn {
  function setParams(args: any[]): void {
    logger.params = getLogParams(args, options);
  }

  function logError(this: any, error: any): void {
    logger.error(error, {
      kind: options?.kind || this.__kind,
      className: (fn as any).name || 'Anonymous'
    });
  }

  const factory = catchExceptionFactory(fn, { logError, setParams }, options);

  return options?.isSync ? (factory.syncFn as Fn) : (factory.asyncFn as Fn);
}
