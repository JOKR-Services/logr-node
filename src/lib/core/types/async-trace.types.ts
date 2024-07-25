import { RegisteredErrorDTO } from '@core/dtos';

export type AsyncTrace = {
  id?: string;
  correlationId?: string;
  causationId?: string;
  registeredError?: RegisteredErrorDTO | undefined;
};
