import { ILoggerErrorPattern } from '@domain/interfaces';

import { LoggerStdout } from './logger.stdout';

describe('LoggerStdout', () => {
  let logger: LoggerStdout;

  beforeEach(() => {
    logger = new LoggerStdout();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('error', () => {
    it('should write the error message to process.stderr', () => {
      const error: ILoggerErrorPattern = {
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

      logger.error(error);

      expect(writeSpy).toHaveBeenCalledWith(`${JSON.stringify(error)}`);
      expect(writeSpy).toBeCalledTimes(1);
    });
  });
});
