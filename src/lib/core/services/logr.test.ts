import { TriggerInDTO } from '@core/dtos';
import { getErrorPattern, getLogPattern } from '@core/helpers';
import { Logger, LoggerService } from '@core/interfaces';
import { Logr } from '@core/services/logr.service';
import { ErrorMock } from '@fixtures/mock/error.mock';
import { errorPatternMock } from '@fixtures/mock/patterns.mock';

const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
} as Logger;

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = new Logr(loggerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('error', () => {
    const trigger = {
      className: errorPatternMock.logger.name,
      methodName: errorPatternMock.logger.method_name,
      kind: errorPatternMock.error.kind
    };

    it('should call error log with correct error pattern if all data is given', () => {
      loggerService.trigger = trigger;

      loggerService.error(ErrorMock, 'Test Title', ...errorPatternMock.logger.params);

      expect(loggerMock.error).toBeCalledWith(
        {
          ...getErrorPattern(ErrorMock, trigger, ...errorPatternMock.logger.params),
          timestamp: expect.any(String)
        },
        'Test Title'
      );
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with correct error pattern if all data is given with params', () => {
      loggerService.trigger = trigger;

      loggerService.error(ErrorMock, 'Title Test', 'foo');

      expect(loggerMock.error).toBeCalledWith(
        {
          ...getErrorPattern(ErrorMock, trigger, 'foo'),
          timestamp: expect.any(String)
        },
        'Title Test'
      );
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with default value of missing properties', () => {
      loggerService.error(null, 'Title Test');

      expect(loggerMock.error).toBeCalledWith(
        {
          ...getErrorPattern(null, loggerService.trigger),
          timestamp: expect.any(String)
        },
        'Title Test'
      );
      expect(loggerMock.error).toBeCalledTimes(1);
    });
  });

  describe('info', () => {
    const trigger: TriggerInDTO = {
      className: 'ClassName',
      methodName: 'Method',
      kind: 'Application'
    };

    beforeEach(() => {
      loggerService.trigger = trigger;
    });

    it('should call info with correct params', () => {
      loggerService.info('test message', { a: 1, b: 2 });

      const pattern = getLogPattern(trigger, 'test message', { a: 1, b: 2 });

      expect(loggerMock.info).toHaveBeenCalledWith({
        ...pattern,
        timestamp: expect.any(String)
      });
    });
  });

  describe('warn', () => {
    const trigger: TriggerInDTO = {
      className: 'ClassName',
      methodName: 'Method',
      kind: 'Application'
    };

    beforeEach(() => {
      loggerService.trigger = trigger;
    });

    it('should call warn with correct params', () => {
      loggerService.warn('test message', { a: 1, b: 2 });

      const pattern = getLogPattern(trigger, 'test message', { a: 1, b: 2 });

      expect(loggerMock.warn).toHaveBeenCalledWith({
        ...pattern,
        timestamp: expect.any(String)
      });
    });
  });
});
