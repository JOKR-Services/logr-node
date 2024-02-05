import { TriggerInDTO } from '@core/dtos';
import { LogPatternDTO } from '@core/dtos/patterns.dto';

const DEFAULT_VALUE = 'unknown';

export function getLogPattern(
  trigger: TriggerInDTO,
  message: string,
  ...params: unknown[]
): LogPatternDTO {
  return {
    timestamp: new Date().toISOString(),
    logger: {
      name: trigger?.className ?? DEFAULT_VALUE,
      method_name: trigger?.methodName ?? DEFAULT_VALUE,
      params,
      trace: {
        correlation_id: trigger?.correlationId ?? DEFAULT_VALUE,
        causation_id: trigger?.causationId ?? DEFAULT_VALUE
      }
    },
    message
  };
}
