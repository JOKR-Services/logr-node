import { CatchException, UseLoggerError } from '@domain/decorators';
import { LoggerStdout } from '@infra/stdout';

@UseLoggerError(new LoggerStdout())
class BasicClass {
  @CatchException()
  public basicFunction(_someParam: any, _test: string) {
    const e: any = {};
    console.log(e.someProperty.throwErrorNow);
  }
}

const teste = new BasicClass();

teste.basicFunction({ someParams: true }, 'oi');
