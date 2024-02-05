import { TriggerInDTO } from '@core/dtos';
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
    loggerService = Logr.getInstance(loggerMock);
  });

  afterEach(() => {
    loggerService.clearErrorRegister();
    jest.clearAllMocks();
  });

  describe('registerError', () => {
    it('should register an error with trigger and params', () => {
      const trigger = {
        className: 'TestClass',
        methodName: 'testMethod',
        kind: 'error'
      };
      const params = ['param1', 'param2'];

      loggerService.registerError(ErrorMock, trigger, '', params);

      const expectedRegisteredError = {
        isRegistered: true,
        value: {
          error: ErrorMock,
          title: '',
          trigger,
          params
        }
      };

      expect(loggerService.registeredError).toEqual(expectedRegisteredError);
    });

    it('should not register an error if already registered', () => {
      const firstTrigger = {
        className: 'first-class',
        methodName: 'first-method',
        kind: 'first-error'
      };
      const firstParams = ['first-params1', 'first-param2'];

      loggerService.registerError(ErrorMock, firstTrigger, '', firstParams);

      const trigger = {
        className: 'class',
        methodName: 'method',
        kind: 'error'
      };
      const params = ['param1', 'param2'];
      loggerService.registerError(ErrorMock, trigger, '', params);

      const expectedRegisteredError = {
        isRegistered: true,
        value: {
          error: ErrorMock,
          title: '',
          trigger: firstTrigger,
          params: firstParams
        }
      };

      expect(loggerService.registeredError).toEqual(expectedRegisteredError);
    });
  });

  describe('clearErrorRegister', () => {
    it('should clear the registered error', () => {
      const trigger = {
        className: 'TestClass',
        methodName: 'testMethod',
        kind: 'error'
      };
      const params = ['param1', 'param2'];

      loggerService.registerError(ErrorMock, trigger, '', params);
      loggerService.clearErrorRegister();

      const expectedRegisteredError = {
        isRegistered: false
      };

      expect(loggerService.registeredError).toEqual(expectedRegisteredError);
    });
  });

  describe('error', () => {
    const trigger = {
      className: errorPatternMock.logger.name,
      methodName: errorPatternMock.logger.method_name,
      kind: errorPatternMock.error.kind,
      correlationId: 'correlation',
      causationId: 'causation'
    };

    it('should call error log with correct error pattern if all data is given', () => {
      loggerService.error(ErrorMock, trigger, 'Test Title', ...errorPatternMock.logger.params);

      const { timestamp: _, ...expected } = errorPatternMock;

      expect(loggerMock.error).toBeCalledWith(
        {
          ...expected,
          timestamp: expect.any(String)
        },
        'Test Title'
      );
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with correct error pattern if all data is given with params', () => {
      loggerService.error(ErrorMock, trigger, 'Title Test', 'foo');

      const { timestamp: _, ...expected } = errorPatternMock;

      expect(loggerMock.error).toBeCalledWith(
        {
          ...expected,
          logger: { ...expected.logger, params: ['foo'] },
          timestamp: expect.any(String)
        },
        'Title Test'
      );
      expect(loggerMock.error).toBeCalledTimes(1);
    });

    it('should call error log with default value of missing properties', () => {
      loggerService.error(null, null as unknown as TriggerInDTO, 'Title Test');

      expect(loggerMock.error).toBeCalledWith(
        {
          timestamp: expect.any(String),
          logger: {
            name: 'unknown',
            params: [],
            trace: {
              correlation_id: 'unknown',
              causation_id: 'unknown'
            }
          },
          error: {
            name: 'unknown',
            kind: 'unknown',
            message: 'unknown',
            stack: 'unknown'
          }
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
      kind: 'Application',
      causationId: 'Causation',
      correlationId: 'Correlation'
    };

    it('should call info with correct params', () => {
      loggerService.info(trigger, 'test message', { a: 1, b: 2 });

      expect(loggerMock.info).toHaveBeenCalledWith({
        timestamp: expect.any(String),
        message: 'test message',
        logger: {
          name: 'ClassName',
          method_name: 'Method',
          params: [{ a: 1, b: 2 }],
          trace: {
            correlation_id: 'Correlation',
            causation_id: 'Causation'
          }
        }
      });
    });
  });

  describe('warn', () => {
    const trigger: TriggerInDTO = {
      className: 'ClassName',
      methodName: 'Method',
      kind: 'Application',
      causationId: 'Causation',
      correlationId: 'Correlation'
    };

    it('should call warn with correct params', () => {
      loggerService.warn(trigger, 'test message', { a: 1, b: 2 });

      expect(loggerMock.warn).toHaveBeenCalledWith({
        timestamp: expect.any(String),
        message: 'test message',
        logger: {
          name: 'ClassName',
          method_name: 'Method',
          params: [{ a: 1, b: 2 }],
          trace: {
            correlation_id: 'Correlation',
            causation_id: 'Causation'
          }
        }
      });
    });
  });
});
