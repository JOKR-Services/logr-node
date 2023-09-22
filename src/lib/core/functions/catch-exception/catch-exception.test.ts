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
});
