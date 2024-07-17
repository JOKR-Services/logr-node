import { Logr } from '@core/services';

export function Loggable(loggerKey = 'logger') {
  return function (_: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (this[loggerKey] instanceof Logr) {
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
