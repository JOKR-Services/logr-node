import { ErrorPatternDTO, LogPatternDTO } from '@core/dtos';

import { LoggerStdout } from './logger.stdout';

describe('LoggerStdout', () => {
  let logger: LoggerStdout;

  beforeEach(() => {
    (process.env as any).LOGR_LINE_BREAK = 'false';
    logger = new LoggerStdout();
  });

  afterEach(() => {
    delete (process.env as any).LOGR_LINE_BREAK;
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

      const writeSpy = jest.spyOn(console, 'error').mockImplementation();

      logger.error(errorPatternDTO, '');

      expect(writeSpy).toHaveBeenCalledWith(
        '\x1b[31m',
        '',
        JSON.stringify(errorPatternDTO),
        '\x1b[0m'
      );
      expect(writeSpy).toBeCalledTimes(1);
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

      const writeSpy = jest.spyOn(console, 'info').mockImplementation();

      logger.info(logPatternDTO);

      expect(writeSpy).toHaveBeenCalledWith(JSON.stringify(logPatternDTO));
      expect(writeSpy).toBeCalledTimes(1);
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

      const writeSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn(logPatternDTO);

      expect(writeSpy).toHaveBeenCalledWith(JSON.stringify(logPatternDTO));
      expect(writeSpy).toBeCalledTimes(1);
    });
  });
});
