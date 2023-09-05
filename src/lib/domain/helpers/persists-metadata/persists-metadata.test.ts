import { persistsMetadata } from '@domain/helpers';

describe('persistsMetadata', () => {
  it('should copy metadata correctly', () => {
    const method = () => void 0;
    const originalMethod = () => void 0;
    Reflect.defineMetadata('test-metadata-key', 'test-metadata-value', originalMethod);

    persistsMetadata(method, originalMethod);

    const metadataValue = Reflect.getOwnMetadata('test-metadata-key', method);
    expect(metadataValue).toBe('test-metadata-value');
  });

  it('should handle no metadata safely', () => {
    const method = () => void 0;
    const originalMethod = () => void 0;

    persistsMetadata(method, originalMethod);

    const metadataValue = Reflect.getOwnMetadata('test-metadata-key', method);
    expect(metadataValue).toBeUndefined();
  });
});
