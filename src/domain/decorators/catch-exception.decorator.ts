/**
 * Captura a exceção e escreve de acordo com o logger utilizando no @UseLoggerError
 * @returns void
 */
export function CatchException() {
  return function (_: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (e: any) {
        const { __className, __kind, __logger } = this as any;

        const trigger = {
          name: __className,
          method_name: propertyKey,
          params: JSON.stringify(args)
        };

        const err = {
          stack: e.stack,
          name: e.name,
          message: e.message,
          kind: __kind
        };

        __logger.error({ error: err, logger: trigger });
      }
    };
  };
}
