import tracer from 'dd-trace';

class DDTrace {
  private static instance: DDTrace;

  private constructor() {
    tracer.init({
      logInjection: true
    });
  }

  public static getInstance(): DDTrace {
    if (!this.instance) {
      this.instance = new DDTrace();
    }

    return this.instance;
  }
}

DDTrace.getInstance();
