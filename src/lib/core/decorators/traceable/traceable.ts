// import { AsyncTrace, AsyncTraceStorage } from 'src/core';
// import { generateUUID } from 'src/utils';

// export function Traceable(): MethodDecorator {
//   return function (
//     target: any,
//     methodName: string,
//     descriptor: PropertyDescriptor
//   ): PropertyDescriptor {
//     const originalMethod = descriptor.value;

//     descriptor.value = function (...args: any[]) {
//       if (AsyncTraceStorage.outsideAsyncContext) {
//         const uuid = generateUUID();
//         const store: AsyncTrace = {
//           correlationId: uuid,
//           causationId: uuid
//         };

//         return AsyncTraceStorage.run(store, () => originalMethod.apply(this, args));
//       }

//       return originalMethod.apply(this, args);
//     };

//     return descriptor;
//   };
// }
