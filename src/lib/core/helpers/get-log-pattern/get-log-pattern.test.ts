import { getLogPattern } from '@core/helpers';

const mockTimeStamp = expect.any(String);

describe('getLogPattern', () => {
  it('should return the correct log pattern when receive a valid payload', () => {
    const result = getLogPattern(
      {
        className: 'test',
        methodName: 'test'
      },
      'test message',
      { foo: 'foo', bar: { name: 'bar' } }
    );

    expect(result).toMatchObject({
      timestamp: mockTimeStamp,
      logger: {
        name: 'test',
        method_name: 'test',
        params: [{ foo: 'foo', bar: { name: 'bar' } }]
      },
      message: 'test message'
    });
  });

  it('should return "unknown" as the default className if it is empty', () => {
    const result = getLogPattern(
      {
        methodName: 'test'
      } as any,
      'test message',
      { foo: 'foo', bar: { name: 'bar' } }
    );

    expect(result).toMatchObject({
      timestamp: mockTimeStamp,
      logger: {
        name: 'unknown',
        method_name: 'test',
        params: [{ foo: 'foo', bar: { name: 'bar' } }]
      },
      message: 'test message'
    });
  });

  it('should return "unknown" as the default methodName if it is empty', () => {
    const result = getLogPattern(
      {
        className: 'test'
      } as any,
      'test message',
      { foo: 'foo', bar: { name: 'bar' } }
    );

    expect(result).toMatchObject({
      timestamp: mockTimeStamp,
      logger: {
        name: 'test',
        method_name: 'unknown',
        params: [{ foo: 'foo', bar: { name: 'bar' } }]
      },
      message: 'test message'
    });
  });

  it('should return an empty array to params if it is empty', () => {
    const result = getLogPattern(
      {
        className: 'test',
        methodName: 'test',
        kind: 'test'
      },
      'test message'
    );

    expect(result).toMatchObject({
      timestamp: mockTimeStamp,
      logger: {
        name: 'test',
        method_name: 'test',
        params: []
      },
      message: 'test message'
    });
  });
});
