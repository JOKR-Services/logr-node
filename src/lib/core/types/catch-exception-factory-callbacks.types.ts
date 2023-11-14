export type CatchExceptionFactoryCallbacks = {
  logError(error: any, title: string, args: any[]): void;
  registerError(error: any, title: string, args: any[]): void;
};
