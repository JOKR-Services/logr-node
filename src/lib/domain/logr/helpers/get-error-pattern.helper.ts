import { ILoggerErrorPattern, LoggerCaller } from '@domain/interfaces';
import { formatWithOptions } from 'util';

const DEFAULT_VALUE = 'unknown';

export function getErrorPattern(
  err: any,
  caller: LoggerCaller,
  ...params: unknown[]
): ILoggerErrorPattern {
  return {
    timestamp: new Date().toISOString(),
    logger: {
      name: caller?.className || DEFAULT_VALUE,
      method_name: caller?.methodName || DEFAULT_VALUE,
      params: formatWithOptions({ depth: 3, numericSeparator: true }, params)
    },
    error: {
      name: err?.name || DEFAULT_VALUE,
      message: err?.message || DEFAULT_VALUE,
      stack: err?.stack || DEFAULT_VALUE,
      kind: caller?.kind || DEFAULT_VALUE
    }
  };
}
