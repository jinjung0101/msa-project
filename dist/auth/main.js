"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth.module");
const share_1 = require("../../../packages/share/src/index.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_module_1.AuthModule, { logger: false });
    // 1) 커스텀 로거 적용
    app.useLogger(new share_1.CustomLoggerService());
    // 2) 전역 예외 필터 적용
    app.useGlobalFilters(new share_1.AllExceptionsFilter());
    await app.listen(3000);
}
bootstrap();
