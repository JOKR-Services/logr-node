import { Factory } from '@core/interfaces';
import { CatchExceptionFactoryCallbacks, CatchExceptionOptions } from '@core/types';

export function catchExceptionFactory(
  method: any,
  callbacks: CatchExceptionFactoryCallbacks,
  options?: CatchExceptionOptions
): Factory {
  return {
    syncFn(...args): any {
      try {
        return method.apply(this, args);
      } catch (e) {
        let title = '';

        if (options?.errorTitle) {
          title =
            typeof options.errorTitle === 'function'
              ? options.errorTitle.call(this, e, this, ...args)
              : options.errorTitle;
        }

        if (options?.typeErrorHandling === 'REGISTER') {
          callbacks.registerError(e, title, args);
        } else {
          callbacks.logError(e, title, args);
        }

        if (options?.returnOnException) {
          return options?.returnOnException.call(this, e, this, ...args);
        }

        if (options?.onException) {
          options.onException.call(this, e, this, ...args);
        }

        if (!!options?.customErrorInstance) {
          let newErr: any;
          if (typeof options?.customErrorInstance === 'function') {
            newErr = options.customErrorInstance.call(this, e, this, ...args);
          } else {
            newErr = options.customErrorInstance;
          }

          const stackTraceHead = newErr.stack.split('\n').slice(0, 2).join('\n');
          const originalStackTrace = (e as any).stack;
          newErr.stack = stackTraceHead + '\n' + originalStackTrace;

          throw newErr;
        }

        if (options?.bubbleException || options?.typeErrorHandling === 'REGISTER') {
          throw e;
        }
      }
    },

    async asyncFn(...args): Promise<any> {
      try {
        return await method.apply(this, args);
      } catch (e) {
        let title = '';

        if (options?.errorTitle) {
          title =
            typeof options.errorTitle === 'function'
              ? options.errorTitle.call(this, e, this, ...args)
              : options.errorTitle;
        }

        if (options?.typeErrorHandling === 'REGISTER') {
          callbacks.registerError(e, title, args);
        } else {
          callbacks.logError(e, title, args);
        }

        if (options?.returnOnException) {
          return options?.returnOnException.call(this, e, this, ...args);
        }

        if (options?.onException) {
          await options.onException.call(this, e, this, ...args);
        }

        if (!!options?.customErrorInstance) {
          let newErr: any;
          if (typeof options?.customErrorInstance === 'function') {
            newErr = options.customErrorInstance.call(this, e, this, ...args);
          } else {
            newErr = options.customErrorInstance;
          }

          const stackTraceHead = newErr.stack.split('\n').slice(0, 2).join('\n');
          const originalStackTrace = (e as any).stack;
          newErr.stack = stackTraceHead + '\n' + originalStackTrace;

          throw newErr;
        }

        if (options?.bubbleException || options?.typeErrorHandling === 'REGISTER') {
          throw e;
        }
      }
    }
  };
}
