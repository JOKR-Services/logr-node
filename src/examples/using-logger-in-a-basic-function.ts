import { StdoutLogger } from '../infra/stdout/stdout.logger';
import { UseLoggerError } from '../domain/decorators/use-logger-error.decorator';
import { CatchException } from '../domain/decorators/catch-exception.decorator';

@UseLoggerError(new StdoutLogger())
class BasicClass {
	@CatchException()
	basicFunction(someParam: any, teste: string) {
		const e: any = {};
		console.log(e.someProperty.throwErrorNow);
	}
}

const teste = new BasicClass();

teste.basicFunction({ someParams: true }, 'oi');
