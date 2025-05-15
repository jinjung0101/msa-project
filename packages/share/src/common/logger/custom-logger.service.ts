import { ConsoleLogger, Injectable, LogLevel } from "@nestjs/common";

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  constructor() {
    super(""); // prefix 없이
    this.setLogLevels(["log", "error", "warn", "debug"] as LogLevel[]);
  }
  // 필요하다면 override log(), error(), warn() 등 추가 구현
}
