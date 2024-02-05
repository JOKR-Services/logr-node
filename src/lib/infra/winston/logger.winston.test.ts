import { ErrorPatternDTO, LogPatternDTO } from '@core/dtos';

const winstonSpy = { error: jest.fn(), info: jest.fn(), warn: jest.fn() };
jest.mock('winston', () => {
  return {
    createLogger: jest.fn(() => winstonSpy),
    transports: {
      Console: jest.fn()
    },
    config: { npm: { levels: {} } }
  };
});

import { LoggerWinston } from './logger.winston';

describe('LoggerWinston', () => {
  let logger: LoggerWinston;

  beforeEach(() => {
    logger = new LoggerWinston();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('error', () => {
    it('should write the error message to process.stderr', () => {
      const errorPatternDTO: ErrorPatternDTO = {
        timestamp: new Date().toISOString(),
        logger: {
          name: 'test',
          params: 'test',
          method_name: 'test',
          trace: {
            correlation_id: 'test',
            causation_id: 'test'
          }
        },
        error: {
          name: 'test',
          kind: 'test',
          message: 'test',
          stack: 'test'
        }
      };

      logger.error(errorPatternDTO, '');

      expect(winstonSpy.error).toHaveBeenCalledWith('', errorPatternDTO);
    });
  });

  describe('info', () => {
    it('should write the message to process.stderr', () => {
      const logPatternDTO: LogPatternDTO = {
        timestamp: new Date().toISOString(),
        logger: {
          name: 'test',
          params: 'test',
          method_name: 'test',
          trace: {
            correlation_id: 'test',
            causation_id: 'test'
          }
        },
        message: 'some message'
      };

      logger.info(logPatternDTO);

      expect(winstonSpy.info).toHaveBeenCalledWith(logPatternDTO);
      expect(winstonSpy.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('should write the message to process.stderr', () => {
      const logPatternDTO: LogPatternDTO = {
        timestamp: new Date().toISOString(),
        logger: {
          name: 'test',
          params: 'test',
          method_name: 'test',
          trace: {
            correlation_id: 'test',
            causation_id: 'test'
          }
        },
        message: 'some message'
      };

      logger.warn(logPatternDTO);

      expect(winstonSpy.warn).toHaveBeenCalledWith(logPatternDTO);
      expect(winstonSpy.warn).toHaveBeenCalledTimes(1);
    });
  });
});
