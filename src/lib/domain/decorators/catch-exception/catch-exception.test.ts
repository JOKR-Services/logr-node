import { loggerMock as logger } from '@fixtures/mock/logger.mock';

import { CatchException } from './catch-exception.decorator';

const ErrorMock: any = new Error('Some Error');

describe('@CatchException', () => {
  let options: any;
  let target: any;
  let propertyKey: string;
  let descriptor: PropertyDescriptor;

  beforeEach(() => {
    options = {};
    target = {};
    propertyKey = 'methodName';
    descriptor = {
      value: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the method and return its result if no exception is thrown', async () => {
    const args = ['arg1', 'arg2'];
    const returnValue: any = 'result';
    descriptor.value.mockResolvedValue(returnValue);

    const decoratedMethod = CatchException(options, logger)(target, propertyKey, descriptor);
    const result = await decoratedMethod.value.apply(target, args);

    expect(descriptor.value).toEqual(expect.any(Function));
    expect(result).toBe(returnValue);

    expect(logger.error).not.toBeCalled();
  });

  it('should catch the exception, log it with kind, and call onException if provided', async () => {
    const args = ['arg1', 'arg2'];
    const kind = 'test';
    const onException = jest.fn();
    descriptor.value.mockRejectedValue(ErrorMock);

    options.kind = kind;
    options.onException = onException;

    const decoratedMethod = CatchException(options, logger)(target, propertyKey, descriptor);
    await decoratedMethod.value.apply(target, args);

    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: kind,
        className: target.constructor.name,
        methodName: propertyKey
      },
      ...args
    );
    expect(onException).toHaveBeenCalledWith(ErrorMock, target);
  });

  it('should catch the exception, log it, and call onException if provided', async () => {
    const args = ['arg1', 'arg2'];
    const onException = jest.fn();
    descriptor.value.mockRejectedValue(ErrorMock);

    options.onException = onException;

    const decoratedMethod = CatchException(options, logger)(target, propertyKey, descriptor);
    await decoratedMethod.value.apply(target, args);

    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: undefined,
        className: target.constructor.name,
        methodName: propertyKey
      },
      ...args
    );
    expect(onException).toHaveBeenCalledWith(ErrorMock, target);
  });

  it('should catch the exception, log it, and throw it if bubbleException is true', async () => {
    const args = ['arg1', 'arg2'];
    descriptor.value.mockRejectedValue(ErrorMock);

    options.bubbleException = true;

    const decoratedMethod = CatchException(options, logger)(target, propertyKey, descriptor);

    await expect(decoratedMethod.value.apply(target, args)).rejects.toThrow(ErrorMock);

    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: undefined,
        className: target.constructor.name,
        methodName: propertyKey
      },
      ...args
    );
  });
});