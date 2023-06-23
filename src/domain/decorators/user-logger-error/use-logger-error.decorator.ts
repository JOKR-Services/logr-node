import { ILogger } from '@domain/interfaces';

type Target = { new (...args: any[]): NonNullable<unknown> };

export function UseLoggerError<T extends Target>(logger: ILogger) {
  return function (target: T): void {
    Object.defineProperty(target.prototype, '__className', {
      configurable: true,
      value: target.name
    });
    Object.defineProperty(target.prototype, '__logger', {
      configurable: true,
      value: logger
    });
  };
}
