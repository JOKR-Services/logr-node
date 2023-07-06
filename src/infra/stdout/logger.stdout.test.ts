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

      const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation();

      logger.error(error);

      expect(writeSpy).toHaveBeenCalledWith(JSON.stringify(error, null, 2));
      expect(writeSpy).toBeCalledTimes(1);
    });
  });
});
