import { CatchException } from '@core/decorators/catch-exception/catch-exception.decorator';
import { CatchExceptionOptions } from '@core/types';
import { ErrorMock } from '@fixtures/mock/error.mock';
import { loggerMock } from '@fixtures/mock/logger.mock';

const mockResult = 'Foo';

describe('@CatchException', () => {
  let options: CatchExceptionOptions;
  let target: any;
  let propertyKey: string;
  let descriptor: PropertyDescriptor;

  beforeEach(() => {
    options = {};
    target = {};
    propertyKey = 'methodName';
    descriptor = {
      value: jest.fn().mockImplementation(() => mockResult)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the method and return its result if no exception is thrown', async () => {
    const args = ['arg1', 'arg2'];

    const asyncDecoratedMethod = CatchException(options, loggerMock)(
      target,
      propertyKey,
      descriptor
    );
    const asyncResult = await asyncDecoratedMethod.value.apply(target, args);

    expect(asyncDecoratedMethod.value).toEqual(expect.any(Function));
    expect(asyncResult).toBe(mockResult);
    expect(loggerMock.error).not.toBeCalled();
  });

  it('should call the sync method and return its result if no exception is thrown', () => {
    options.isSync = true;
    const syncDecoratedMethod = CatchException(options, loggerMock)(
      target,
      propertyKey,
      descriptor
    );
    const syncResult = syncDecoratedMethod.value.apply(target, null);

    expect(syncDecoratedMethod.value).toEqual(expect.any(Function));
    expect(syncResult).toBe(mockResult);
    expect(loggerMock.error).not.toBeCalled();
  });

  it('should catch the exception and log it', async () => {
    descriptor.value.mockRejectedValue(ErrorMock as any);

    const decorated = CatchException(options, loggerMock)(target, propertyKey, descriptor);
    await decorated.value.apply(target, null);

    expect(loggerMock.error).toBeCalled();
    expect(loggerMock.error).toBeCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        className: 'Object',
        kind: undefined,
        methodName: 'methodName'
      },
      ''
    );
  });

  it('should catch the exception, register and rethrow the error', async () => {
    descriptor.value.mockRejectedValue(ErrorMock as any);
    options.typeErrorHandling = 'REGISTER';
    const fnDecorated = CatchException(options, loggerMock)(target, propertyKey, descriptor);

    await expect(fnDecorated.value.apply(target, null)).rejects.toThrow(ErrorMock);

    expect(loggerMock.registerError).toBeCalled();
    expect(loggerMock.registerError).toBeCalledTimes(1);
    expect(loggerMock.registerError).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: undefined,
        className: 'Object',
        methodName: 'methodName'
      },
      '',
      []
    );
  });

  it('should log the registered error and clear the error register if an error is already registered', async () => {
    loggerMock.registeredError = {
      isRegistered: true,
      value: {
        error: ErrorMock,
        trigger: {
          className: 'Object',
          kind: 'custom',
          methodName: 'customMethod'
        },
        params: ['param1', 'param2']
      }
    };

    descriptor.value.mockRejectedValue(new Error('Another error') as any);

    const decorated = CatchException(options, loggerMock)(target, propertyKey, descriptor);
    await decorated.value.apply(target, null);

    expect(loggerMock.error).toBeCalled();
    expect(loggerMock.error).toBeCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        className: 'Object',
        kind: 'custom',
        methodName: 'customMethod'
      },
      undefined,
      'param1',
      'param2'
    );

    expect(loggerMock.clearErrorRegister).toBeCalled();
    expect(loggerMock.clearErrorRegister).toBeCalledTimes(1);
  });
});
