export type Factory = {
  syncFn(...args: any[]): any;
  asyncFn(...args: any[]): Promise<any>;
};
