import { catchException } from '@core/functions';
import { CatchExceptionOptions } from '@core/types';
import { ErrorMock } from '@fixtures/mock/error.mock';
import { loggerMock } from '@fixtures/mock/logger.mock';

const mockResult = 'Foo';

describe('catchException', () => {
  let options: CatchExceptionOptions;
  let fn: jest.Mock;
  let logger: typeof loggerMock;

  beforeEach(() => {
    options = {};
    fn = jest.fn(() => mockResult);
    logger = { ...loggerMock, error: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the function and return its result if no exception is thrown', async () => {
    const args = ['arg1', 'arg2'];
    options.isSync = true;

    const decoratedFn = catchException(fn, options, logger);
    const result = decoratedFn(...args);

    expect(result).toBe(mockResult);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(...args);
    expect(logger.error).not.toBeCalled();
  });

  it('should catch the exception and log it', async () => {
    fn.mockRejectedValue(ErrorMock as any);

    const decoratedFn = catchException(fn, options, logger);
    await decoratedFn();

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(ErrorMock, {
      className: 'mockConstructor',
      kind: undefined
    });
  });

  it('should catch the exception, register and rethrow the error', async () => {
    fn.mockRejectedValue(ErrorMock as any);
    options.typeErrorHandling = 'REGISTER';

    const decoratedFn = catchException(fn, options, logger);
    await expect(decoratedFn()).rejects.toThrow(ErrorMock);

    expect(logger.registerError).toBeCalled();
    expect(logger.registerError).toBeCalledTimes(1);
    expect(logger.registerError).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: undefined,
        className: 'mockConstructor'
      },
      []
    );
  });

  it('should log the registered error and clear the error register if an error is already registered', async () => {
    logger.registeredError = {
      isRegistered: true,
      value: {
        error: ErrorMock,
        trigger: {
          className: 'mockConstructor',
          kind: undefined
        },
        params: ['param1', 'param2']
      }
    };

    fn.mockRejectedValue(ErrorMock as any);

    const decoratedFn = catchException(fn, options, logger);
    await decoratedFn();

    expect(logger.error).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      ErrorMock,
      {
        kind: undefined,
        className: 'mockConstructor'
      },
      'param1',
      'param2'
    );

    expect(logger.clearErrorRegister).toBeCalled();
    expect(logger.clearErrorRegister).toBeCalledTimes(1);
  });
});
