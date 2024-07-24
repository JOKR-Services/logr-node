import { AsyncTrace, AsyncTraceStorage } from '@core/storages';
import { generateUUID } from '@utils/index';

export function Traceable() {
  return function (_: any, __: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (AsyncTraceStorage.outsideAsyncContext) {
        const uuid = generateUUID();
        const store: AsyncTrace = {
          correlationId: uuid,
          causationId: uuid
        };

        return AsyncTraceStorage.run(store, () => originalMethod.apply(this, args));
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
