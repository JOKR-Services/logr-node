import { TriggerInDTO } from '@core/dtos';
import { Logger, LoggerService as ILoggerService } from '@core/interfaces';
import { Logr } from '@core/services/logr.service';
import { ErrorMock } from '@fixtures/mock/error.mock';
import { errorPatternMock } from '@fixtures/mock/patterns.mock';

const loggerMock = {
  error: jest.fn()
} as Logger;

describe('LoggerService', () => {
  let loggerService: ILoggerService;

  beforeEach(() => {
    loggerService = Logr.getInstance(loggerMock);
  });

  afterEach(() => {
    loggerService.params = [];
    jest.clearAllMocks();
  });

  describe('LoggerService - error', () => {
    it('should call error log with correct error pattern if all data is given', () => {
      loggerService.params = errorPatternMock.logger.params;
      const trigger = {
        className: errorPatternMock.logger.name,
        methodName: errorPatternMock.logger.method_name,
        kind: errorPatternMock.error.kind
      };

      loggerService.error(ErrorMock, trigger);

      const { timestamp: _, ...expected } = errorPatternMock;

      expect(loggerMock.error).toBeCalledWith({ ...expected, timestamp: expect.any(String) });
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with correct error pattern if all data is given with params', () => {
      const trigger = {
        className: errorPatternMock.logger.name,
        methodName: errorPatternMock.logger.method_name,
        kind: errorPatternMock.error.kind
      };

      loggerService.error(ErrorMock, trigger, 'foo');

      const { timestamp: _, ...expected } = errorPatternMock;

      expect(loggerMock.error).toBeCalledWith({
        ...expected,
        logger: { ...expected.logger, params: ['foo'] },
        timestamp: expect.any(String)
      });
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with default value of missing properties', () => {
      loggerService.error(null, null as unknown as TriggerInDTO);

      expect(loggerMock.error).toBeCalledWith({
        timestamp: expect.any(String),
        logger: {
          name: 'unknown',
          params: []
        },
        error: {
          name: 'unknown',
          kind: 'unknown',
          message: 'unknown',
          stack: 'unknown'
        }
      });
      expect(loggerMock.error).toBeCalledTimes(1);
    });
  });
});
