import { LoggerService } from '@core/interfaces';

// TODO: change interface
abstract class ZeusLogger {
  constructor(protected logger: LoggerService) {}
}

export function Loggable(loggerKey = 'logger') {
  return function (_: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (this[loggerKey] instanceof ZeusLogger) {
        this[loggerKey].trigger = {
          methodName,
          className: this.constructor.name
        };
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
