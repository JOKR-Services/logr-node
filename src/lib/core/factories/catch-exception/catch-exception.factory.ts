import { Factory } from '@core/interfaces';
import { CatchExceptionFactoryCallbacks, CatchExceptionOptions } from '@core/types';

export function catchExceptionFactory(
  method: any,
  callbacks: CatchExceptionFactoryCallbacks,
  options?: CatchExceptionOptions
): Factory {
  return {
    syncFn(...args): any {
      callbacks.setParams(args);

      try {
        return method.apply(this, args);
      } catch (e) {
        callbacks.logError(e);

        if (options?.returnOnException) {
          return options?.returnOnException.call(this, e, this, ...args);
        }

        if (options?.onException) {
          options.onException.call(this, e, this, ...args);
        }

        if (!!options?.customErrorInstance) {
          if (typeof options?.customErrorInstance === 'function') {
            throw options.customErrorInstance.call(this, e, this, ...args);
          }

          throw options.customErrorInstance;
        }

        if (options?.bubbleException) {
          throw e;
        }
      }
    },

    async asyncFn(...args): Promise<any> {
      callbacks.setParams(args);

      try {
        return await method.apply(this, args);
      } catch (e) {
        callbacks.logError(e);

        if (options?.returnOnException) {
          return options?.returnOnException.call(this, e, this, ...args);
        }

        if (options?.onException) {
          await options.onException.call(this, e, this, ...args);
        }

        if (!!options?.customErrorInstance) {
          if (typeof options?.customErrorInstance === 'function') {
            throw options.customErrorInstance.call(this, e, this, ...args);
          }

          throw options.customErrorInstance;
        }

        if (options?.bubbleException) {
          throw e;
        }
      }
    }
  };
}
