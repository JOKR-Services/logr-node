import { CommonFactoryCallbacks } from '@core/types/common-factory-callbacks.types';

export type CatchExceptionFactoryCallbacks = CommonFactoryCallbacks & {
  logError(error: any): void;
};
