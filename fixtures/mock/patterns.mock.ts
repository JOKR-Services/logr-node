import { ErrorMock } from './error.mock';

export const errorPatternMock = {
  timestamp: new Date().toISOString(),
  logger: {
    name: 'test',
    method_name: 'test',
    params: [{ foo: 'foo', bar: { name: 'bar' } }, 'test'],
    trace: {
      causation_id: 'causation',
      correlation_id: 'correlation'
    }
  },
  error: {
    name: ErrorMock.name,
    kind: 'test',
    message: ErrorMock.message,
    stack: ErrorMock.stack as string
  }
};
