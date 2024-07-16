import { AsyncLocalStorage } from 'async_hooks';

import { RegisteredErrorDTO, TriggerInDTO } from '../../dtos';

export type AsyncTrace = {
  correlationId?: string;
  causationId?: string;
  registeredError?: RegisteredErrorDTO | undefined;
};

export class AsyncTraceStorage {
  private static instance: AsyncTraceStorage;
  private als: AsyncLocalStorage<AsyncTrace>;
  private loggerRegisteredError: RegisteredErrorDTO = {
    isRegistered: false
  };

  private constructor() {
    this.als = new AsyncLocalStorage<AsyncTrace>();
  }

  private static getInstance(): AsyncTraceStorage {
    if (!this.instance) {
      this.instance = new AsyncTraceStorage();
    }
    return this.instance;
  }

  public registerError(error: any, trigger: TriggerInDTO, title: string, params: any[]): void {
    if (this.loggerRegisteredError.isRegistered) return;

    this.loggerRegisteredError = {
      isRegistered: true,
      value: {
        error,
        trigger,
        params,
        title
      }
    };
  }

  private static getStore: AsyncLocalStorage<AsyncTrace>['getStore'] =
    this.getInstance().als.getStore.bind(this.getInstance().als);

  public static run: AsyncLocalStorage<AsyncTrace>['run'] = this.getInstance().als.run.bind(
    this.getInstance().als
  );

  public static get outsideAsyncContext(): boolean {
    return this.getStore() === undefined;
  }

  public static get correlationId(): string | undefined {
    return this.getStore()?.correlationId;
  }

  public static set correlationId(value: string | undefined) {
    const store = this.getStore();
    if (!!store && !!value) {
      store.correlationId = value;
    }
  }

  public static get causationId(): string | undefined {
    return this.getStore()?.causationId;
  }

  public static set causationId(value: string | undefined) {
    const store = this.getStore();
    if (!!store && !!value) {
      store.causationId = value;
    }
  }

  public static setRegisteredError(
    error: any,
    trigger: TriggerInDTO,
    title: string,
    ...params: any[]
  ): void {
    const store = this.getStore();
    if (!store) {
      return;
    }
    if (!store.registeredError) {
      store.registeredError = { value: { error, trigger, title, params } };
    }
  }

  public static clearRegisteredError(): void {
    const store = this.getStore();
    if (!!store) {
      delete store.registeredError;
    }
  }

  public static get registeredError(): RegisteredErrorDTO | undefined {
    return this.getStore()?.registeredError;
  }
}
