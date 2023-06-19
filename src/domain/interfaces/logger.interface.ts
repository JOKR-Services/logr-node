import { ILoggerErrorPattern } from './logger-error-pattern.interface';

export interface ILogger {
  error: (error: ILoggerErrorPattern) => void;
}
