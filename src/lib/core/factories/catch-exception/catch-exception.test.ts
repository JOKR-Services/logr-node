import { catchExceptionFactory } from '@core/factories';
import { ErrorMock } from '@fixtures/mock/error.mock';

const mockMethod = jest.fn();
const logError = jest.fn();

describe('catchExceptionFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the method and return the result', async () => {
    mockMethod.mockImplementation((...args: number[]) =>
      args.reduce((sum, value) => sum + value, 0)
    );

    const factory = catchExceptionFactory(mockMethod, logError);
    const syncResult = factory.syncFn(1, 2, 3);
    const asyncResult = await factory.asyncFn(1, 2, 3);

    expect(syncResult).toBe(6);
    expect(asyncResult).toBe(6);
    expect(mockMethod).toHaveBeenCalledWith(1, 2, 3);
    expect(logError).not.toHaveBeenCalled();
  });

  it('should catch the exception and rethrow the exception if bubbleException is true and customError is undefined', async () => {
    mockMethod.mockImplementation(() => {
      throw ErrorMock;
    });

    const factory = catchExceptionFactory(mockMethod, logError, { bubbleException: true });

    expect(() => {
      factory.syncFn(1, 2, 3);
    }).toThrow(ErrorMock);
    await expect(factory.asyncFn(1, 2, 3)).rejects.toThrow(ErrorMock);

    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', [1, 2, 3]);
  });

  it('should catch the exception and not throw the exception if bubbleException is false ', async () => {
    mockMethod.mockImplementation(() => {
      throw ErrorMock;
    });

    const factory = catchExceptionFactory(mockMethod, logError, { bubbleException: false });

    expect(factory.syncFn()).toBeUndefined();
    expect(await factory.asyncFn()).toBeUndefined();

    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', []);
  });

  it('should catch the exception and call onExcpetion if provided ', async () => {
    mockMethod.mockImplementation(() => {
      throw ErrorMock;
    });

    const onExpection = jest.fn();

    const factory = catchExceptionFactory(mockMethod, logError, {
      onException: onExpection
    });

    factory.syncFn();
    await factory.asyncFn();

    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', []);
    expect(onExpection).toHaveBeenCalledTimes(2);
  });

  it('should catch the exception, log it, and call returnOnException if provided', async () => {
    mockMethod.mockImplementation(() => {
      throw ErrorMock;
    });

    const returnOnException = jest.fn().mockImplementation(err => err.name);

    const factory = catchExceptionFactory(mockMethod, logError, {
      returnOnException
    });

    const syncResult = factory.syncFn();
    const asyncResult = await factory.asyncFn(1, 2, 3);

    expect(syncResult).toBe(ErrorMock.name);
    expect(asyncResult).toBe(ErrorMock.name);
    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', [1, 2, 3]);
    expect(returnOnException).toHaveBeenCalledTimes(2);
    expect(returnOnException).toHaveBeenCalledWith(ErrorMock, factory);
    expect(returnOnException).toHaveBeenCalledWith(ErrorMock, factory, 1, 2, 3);
  });

  it('should catch the exception, and throw custom error instance if provided', async () => {
    mockMethod.mockImplementation(() => {
      throw ErrorMock;
    });

    const err = new (class CustomError extends Error {})();

    const factory = catchExceptionFactory(mockMethod, logError, { customErrorInstance: err });

    expect(() => {
      factory.syncFn();
    }).toThrow(err);
    await expect(factory.asyncFn()).rejects.toThrow(err);

    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', []);
  });

  it('should catch the exception, and call custom error to throw custom error instance if provided', async () => {
    mockMethod.mockImplementation(function () {
      throw ErrorMock;
    });

    const err = new (class CustomError extends Error {})();
    const customErrorInstance = () => err;

    const factory = catchExceptionFactory(mockMethod, logError, { customErrorInstance });

    expect(() => {
      factory.syncFn();
    }).toThrow(err);
    await expect(factory.asyncFn()).rejects.toThrow(err);

    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(ErrorMock, '', []);
  });
});
