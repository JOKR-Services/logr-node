import { loggerMock } from '@fixtures/mock/logger.mock';

import { CatchException } from './catch-exception.decorator';

const ErrorMock = new Error('Some Error');

const kindMock = 'Test';
const classNameMock = 'ClassMock';

class ClassMock {
  public isString(value: any): void {
    if (typeof value !== 'string') {
      throw ErrorMock;
    }
  }
}

describe('CatchException', () => {
  beforeAll(() => {
    const descriptor = CatchException()(
      ClassMock.constructor,
      'isString',
      Object.getOwnPropertyDescriptor(ClassMock.prototype, 'isString') as PropertyDescriptor
    );

    Object.defineProperty(ClassMock.prototype, 'isString', descriptor);
  });

  beforeEach(() => {
    Object.defineProperties(ClassMock.prototype, {
      __kind: { value: kindMock },
      __className: { value: classNameMock },
      __logger: { value: loggerMock }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log the error and the logger trigger if the method throws an exception', () => {
    new ClassMock().isString(null);

    expect(loggerMock.error).toBeCalled();
    expect(loggerMock.error).toBeCalledTimes(1);
    expect(loggerMock.error).toBeCalledWith({
      error: {
        stack: ErrorMock.stack,
        name: ErrorMock.name,
        message: ErrorMock.message,
        kind: kindMock
      },
      logger: {
        name: classNameMock,
        method_name: 'isString',
        params: '[null]'
      }
    });
  });

  it('should not log if the method does not throw an exception', () => {
    new ClassMock().isString('valid param');

    expect(loggerMock.error).not.toBeCalled();
  });
});
