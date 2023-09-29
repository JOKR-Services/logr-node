export type CatchExceptionFactoryCallbacks = {
  logError(error: any, args: any[]): void;
  registerError(error: any, args: any[]): void;
};
