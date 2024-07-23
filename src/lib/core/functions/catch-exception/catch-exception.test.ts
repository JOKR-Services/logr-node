import { RegisteredErrorDTO } from '@core/dtos';
import { catchException } from '@core/functions';
import { AsyncTraceStorage } from '@core/storages';
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
    expect(logger.error).toHaveBeenCalledWith(ErrorMock, '');
  });

  it('should catch the exception, register and rethrow the error', async () => {
    fn.mockRejectedValue(ErrorMock as any);
    options.typeErrorHandling = 'REGISTER';

    const spy = jest.spyOn(AsyncTraceStorage, 'registeredError', 'set');

    const registeredErrorPayload: RegisteredErrorDTO = {
      error: ErrorMock,
      title: '',
      params: [],
      trigger: { className: 'mockConstructor', kind: undefined }
    };

    await AsyncTraceStorage.run({}, () => {
      const decoratedFn = catchException(fn, options, logger);
      return expect(decoratedFn())
        .rejects.toThrow(ErrorMock)
        .then(() => {
          expect(AsyncTraceStorage.registeredError).toEqual(registeredErrorPayload);
        });
    });

    expect(logger.error).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(registeredErrorPayload);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should log the registered error and clear the error register if an error is already registered', async () => {
    const spy = jest.spyOn(AsyncTraceStorage, 'clearRegisteredError');

    await AsyncTraceStorage.run(
      {
        registeredError: {
          error: ErrorMock,
          title: 'some title',
          trigger: {
            className: 'mockConstructor',
            kind: undefined
          },
          params: ['param1', 'param2']
        }
      },
      () => {
        fn.mockRejectedValue(ErrorMock as any);

        const decoratedFn = catchException(fn, options, logger);

        return decoratedFn();
      }
    );

    expect(logger.error).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(ErrorMock, 'some title', 'param1', 'param2');
    expect(logger.trigger).toEqual({
      className: 'mockConstructor',
      kind: undefined
    });

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(1);
  });

  // TODO: test what happens outside async context =)
});
