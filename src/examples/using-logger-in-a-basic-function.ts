import { CatchException } from '@domain/decorators'; // 'logr-node'
import { Logr } from '@domain/logr';

export class BasicClass {
  constructor(private readonly logger?: Logr) {}

  @CatchException({ kind: 'Application' })
  public basicFunction(_someParam: any, _test: string): void {
    const e: any = {};
    console.log(e.someProperty.throwErrorNow);
  }
}

const teste = new BasicClass();

teste.basicFunction({ someParams: true }, 'oi');
