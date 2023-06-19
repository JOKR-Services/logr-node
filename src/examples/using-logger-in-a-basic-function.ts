import { CatchException } from '../domain/decorators/catch-exception.decorator';
import { UseLoggerError } from '../domain/decorators/use-logger-error.decorator';
import { StdoutLogger } from '../infra/stdout/stdout.logger';

@UseLoggerError(new StdoutLogger())
class BasicClass {
  @CatchException()
  public basicFunction(_someParam: any, _test: string) {
    const e: any = {};
    console.log(e.someProperty.throwErrorNow);
  }
}

const teste = new BasicClass();

teste.basicFunction({ someParams: true }, 'oi');
