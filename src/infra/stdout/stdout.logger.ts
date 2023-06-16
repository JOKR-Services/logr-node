import { ILoggerErrorPattern } from '../../domain/interfaces/logger-error-pattern.interface';
import { ILogger } from '../../domain/interfaces';

export class StdoutLogger implements ILogger {
	error(error: ILoggerErrorPattern): void {
		console.log(error);
	}
}
