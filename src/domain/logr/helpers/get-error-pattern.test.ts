import { getErrorPattern } from './get-error-pattern.helper';

const mockErr = new Error('Mocked');

describe('getErrorPattern', () => {
  it('should return the correct error pattern when receive a valid payload', () => {
    const result = getErrorPattern(
      mockErr,
      {
        className: 'test',
        methodName: 'test',
        kind: 'Test'
      },
      { body: 'test' },
      'test'
    );

    expect(result).toMatchObject({
      logger: {
        name: 'test',
        method_name: 'test',
        params: "[ { body: 'test' }, 'test' ]"
      },
      error: {
        name: mockErr.name,
        stack: mockErr.stack,
        message: mockErr.message,
        kind: 'Test'
      }
    });
  });

  it('should return "unknown" as default className if className is empty', () => {
    const result = getErrorPattern(
      mockErr,
      {
        methodName: 'test',
        kind: 'Test'
      } as any,
      { body: 'test' },
      'test'
    );

    expect(result).toMatchObject({
      logger: {
        name: 'unknown',
        method_name: 'test',
        params: "[ { body: 'test' }, 'test' ]"
      },
      error: {
        name: mockErr.name,
        stack: mockErr.stack,
        message: mockErr.message,
        kind: 'Test'
      }
    });
  });

  it('should return "unknown" as default kind if kind is empty', () => {
    const result = getErrorPattern(
      mockErr,
      {
        className: 'test',
        methodName: 'test'
      } as any,
      { body: 'test' },
      'test'
    );

    expect(result).toMatchObject({
      logger: {
        name: 'test',
        method_name: 'test',
        params: "[ { body: 'test' }, 'test' ]"
      },
      error: {
        name: mockErr.name,
        stack: mockErr.stack,
        message: mockErr.message,
        kind: 'unknown'
      }
    });
  });

  it('should return "unknown" as default methodName if methodName is empty', () => {
    const result = getErrorPattern(
      mockErr,
      {
        className: 'test',
        kind: 'Test'
      } as any,
      { body: 'test' },
      'test'
    );

    expect(result).toMatchObject({
      logger: {
        name: 'test',
        method_name: 'unknown',
        params: "[ { body: 'test' }, 'test' ]"
      },
      error: {
        name: mockErr.name,
        stack: mockErr.stack,
        message: mockErr.message,
        kind: 'Test'
      }
    });
  });

  it('should return string of empty array to params if params is empty', () => {
    const result = getErrorPattern(mockErr, {
      className: 'test',
      methodName: 'test',
      kind: 'Test'
    });

    expect(result).toMatchObject({
      logger: {
        name: 'test',
        method_name: 'test',
        params: '[]'
      },
      error: {
        name: mockErr.name,
        stack: mockErr.stack,
        message: mockErr.message,
        kind: 'Test'
      }
    });
  });

  it('should sets "unknown" as default value to all error properties if error not contains an exception', () => {
    const result = getErrorPattern(
      {},
      {
        className: 'test',
        methodName: 'test',
        kind: 'Test'
      },
      { body: 'test' },
      'test'
    );

    expect(result).toMatchObject({
      logger: {
        name: 'test',
        method_name: 'test',
        params: "[ { body: 'test' }, 'test' ]"
      },
      error: {
        name: 'unknown',
        stack: 'unknown',
        message: 'unknown',
        kind: 'Test'
      }
    });
  });
});
