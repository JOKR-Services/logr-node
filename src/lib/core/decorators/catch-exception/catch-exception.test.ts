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
    expect(loggerMock.error).toHaveBeenCalledWith(ErrorMock, {
      className: 'Object',
      kind: undefined,
      methodName: 'methodName'
    });
  });
});
