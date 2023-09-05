import 'reflect-metadata';

export function persistsMetadata(method: any, originalMethod: any): void {
  const metadataKeys: string[] = Reflect.getOwnMetadataKeys(originalMethod) || [];

  metadataKeys.forEach(metadataKey => {
    const metadataValue = Reflect.getOwnMetadata(metadataKey, originalMethod);

    if (!metadataValue) return;

    Reflect.defineMetadata(metadataKey, metadataValue, method);
  });
}
