import { AsyncTraceStorage } from '@core/storages';

import { Traceable } from './traceable';

const mockResult = 'Foo';

jest.mock('@utils/index', () => ({ generateUUID: () => '123' }));
describe('Traceable', () => {
  let target: any;
  let propertyKey: string;
  let descriptor: PropertyDescriptor;

  beforeEach(() => {
    target = {};
    propertyKey = 'methodName';
    descriptor = {
      value: jest.fn().mockReturnValue(mockResult)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('runs an async context with a random uuid', () => {
    const spy = jest.spyOn(AsyncTraceStorage, 'run');

    const decoratedMethod = Traceable()(target, propertyKey, descriptor);
    const result = decoratedMethod.value.apply(target, null);

    expect(decoratedMethod.value).toEqual(expect.any(Function));
    expect(result).toBe(mockResult);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      { correlationId: '123', causationId: '123' },
      expect.any(Function)
    );
  });

  describe('when running inside an async context', () => {
    it('does not overwrite', () => {
      const decoratedMethod = Traceable()(target, propertyKey, descriptor);

      AsyncTraceStorage.run({ correlationId: 'correlation', causationId: 'causation' }, () => {
        const result = decoratedMethod.value.apply(target, null);

        expect(result).toBe(mockResult);
        expect(AsyncTraceStorage.correlationId).toEqual('correlation');
        expect(AsyncTraceStorage.causationId).toEqual('causation');
      });

      expect(decoratedMethod.value).toEqual(expect.any(Function));
    });
  });
});
