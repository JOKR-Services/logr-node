import { CatchException } from '@domain/decorators'; // 'logr-node'
import { Logr } from '@domain/logr';

export class BasicClass {
  constructor(private readonly logger?: Logr) {}

  public rollback(thisOrCtx: any): void {
    console.log(`rollback called by: ${thisOrCtx}`);
  }

  @CatchException({
    kind: 'Application',
    onException() {
      (this as any).rollback('this');
    }
  })
  public basicFunction(_someParam: any, _test: string): void {
    const e: any = {};
    console.log(e.someProperty.throwErrorNow);
  }

  @CatchException({
    kind: 'Application',
    onException: (err, ctx) => {
      ctx.rollback('ctx');
    }
  })
  public arrowOnException(_someParam: any, _test: string): void {
    const e: any = {};
    console.log(e.someProperty.throwErrorNow);
  }
}

const teste = new BasicClass();

teste.basicFunction({ someParams: true }, 'oi');

teste.arrowOnException({ someParams: true }, 'oi');
