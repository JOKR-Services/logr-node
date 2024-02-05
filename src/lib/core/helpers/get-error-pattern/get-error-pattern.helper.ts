import { ErrorPatternDTO, TriggerInDTO } from '@core/dtos';

const DEFAULT_VALUE = 'unknown';

export function getErrorPattern(
  error: any,
  trigger: TriggerInDTO,
  ...params: unknown[]
): ErrorPatternDTO {
  return {
    timestamp: new Date().toISOString(),
    logger: {
      name: trigger?.className ?? DEFAULT_VALUE,
      method_name: trigger?.methodName,
      params,
      trace: {
        correlation_id: trigger?.correlationId ?? DEFAULT_VALUE,
        causation_id: trigger?.causationId ?? DEFAULT_VALUE
      }
    },
    error: {
      name: error?.name ?? DEFAULT_VALUE,
      message: error?.message ?? DEFAULT_VALUE,
      stack: error?.stack ?? DEFAULT_VALUE,
      kind: trigger?.kind ?? DEFAULT_VALUE
    }
  };
}
