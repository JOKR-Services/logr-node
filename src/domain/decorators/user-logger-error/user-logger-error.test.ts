import { loggerMock } from '@fixtures/mock/logger.mock';

import { UseLoggerError } from './use-logger-error.decorator';

class ClassMock {}

describe('UseLoggerError', () => {
  beforeEach(() => {
    delete (ClassMock.prototype as any).__className;
    delete (ClassMock.prototype as any).__logger;
  });

  it('should ', () => {
    UseLoggerError(loggerMock)(ClassMock);

    const prototype = ClassMock.prototype as any;

    expect(prototype.__className).toBeDefined();
    expect(prototype.__logger).toBeDefined();
    expect(prototype.__className).toBe(ClassMock.name);
    expect(prototype.__logger).toMatchObject(loggerMock);
  });

  it('should  2', () => {
    const prototype = ClassMock.prototype as any;

    expect(prototype.__className).not.toBeDefined();
    expect(prototype.__logger).not.toBeDefined();
  });
});
