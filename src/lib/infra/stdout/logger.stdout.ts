import 'dotenv/config';

import { ErrorPatternDTO } from '@core/dtos';
import { Logger } from '@core/interfaces';

/** @implements {Logger} */
export class LoggerStdout implements Logger {
  private readonly BREAK_LINE = (process.env as any).LOGR_LINE_BREAK.toLowerCase() === 'true';
  private readonly COLOR_DANGER = '\x1b[31m';
  private readonly COLOR_END = '\x1b[0m';

  private stringify(data: any): string {
    if (this.BREAK_LINE) return JSON.stringify(data, null, 2);

    return JSON.stringify(data);
  }

  public error(errorPattern: ErrorPatternDTO): void {
    console.error(
      this.COLOR_DANGER,
      errorPattern.error.message,
      this.stringify(errorPattern),
      this.COLOR_END
    );
  }
}
