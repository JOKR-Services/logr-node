import { ErrorPatternDTO } from '@core/dtos';

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
          method_name: 'test'
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
});
