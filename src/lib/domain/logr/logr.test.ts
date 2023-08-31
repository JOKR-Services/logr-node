import { ILoggerService, LoggerCaller } from '@domain/interfaces';
import { loggerMock } from '@fixtures/mock/logger.mock';
import { format } from 'util';

import { Logr } from './logr';

describe('Logr', () => {
  let logger: ILoggerService;

  beforeEach(() => {
    logger = new Logr(loggerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('error', () => {
    it('should call logger.error with the formatted error message', () => {
      const error = new Error('Test Error');
      const caller: LoggerCaller = { kind: 'test', methodName: 'test', className: 'test' };
      const params = [1, 2, 3];

      logger.error(error, caller, ...params);

      expect(loggerMock.error).toHaveBeenCalledWith({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          kind: caller.kind
        },
        logger: {
          name: caller.className,
          method_name: caller.methodName,
          params: format(params)
        }
      });

      expect(loggerMock.error).toBeCalledTimes(1);
    });
  });
});
