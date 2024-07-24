import { Logr } from '@core/services';

import { Loggable } from './loggable';

const mockResult = 'Foo';

describe('Loggable', () => {
  let target: any;
  let propertyKey: string;
  let descriptor: PropertyDescriptor;
  let loggerKey: string;

  const logger = new Logr();

  const loggerSpy = jest.spyOn(logger, 'trigger', 'set');

  beforeEach(() => {
    loggerKey = 'logger';
    target = {};
    propertyKey = 'methodName';
    descriptor = {
      value: jest.fn().mockReturnValue(mockResult)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets trigger correctly', () => {
    target = { logger };
    const decoratedMethod = Loggable(loggerKey)(target, propertyKey, descriptor);
    const result = decoratedMethod.value.apply(target, null);

    expect(decoratedMethod.value).toEqual(expect.any(Function));
    expect(result).toBe(mockResult);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledWith({ methodName: propertyKey, className: 'Object' });
  });

  describe('when logger is not instance of Logr', () => {
    it('calls method as expected', () => {
      target = { logger: jest.fn() };
      const decoratedMethod = Loggable(loggerKey)(target, propertyKey, descriptor);
      const result = decoratedMethod.value.apply(target, null);

      expect(decoratedMethod.value).toEqual(expect.any(Function));
      expect(result).toBe(mockResult);
    });
  });

  describe('when using a loggerKey', () => {
    beforeEach(() => {
      loggerKey = 'someKey';
    });

    it('sets trigger correctly', () => {
      target = { [loggerKey]: logger };
      const decoratedMethod = Loggable(loggerKey)(target, propertyKey, descriptor);
      const result = decoratedMethod.value.apply(target, null);

      expect(decoratedMethod.value).toEqual(expect.any(Function));
      expect(result).toBe(mockResult);
      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith({ methodName: propertyKey, className: 'Object' });
    });
  });
});
