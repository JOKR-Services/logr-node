export interface IErrorInfo {
  stack: string;
  name: string;
  message: string;
  kind: string;
}

export interface IBasicInfo {
  name: string;
  method_name: string;
  params: unknown;
}

export interface ILoggerErrorPattern {
  logger: IBasicInfo;
  error: IErrorInfo;
}
