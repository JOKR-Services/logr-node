export interface IErrorInfo {
  stack: string;
  name: string;
  message: any;
  kind: string;
}

export interface IBasicInfo {
  name: string;
  method_name: string;
  params: any;
}

export interface ILoggerErrorPattern {
  logger: IBasicInfo;
  error: IErrorInfo;
}
