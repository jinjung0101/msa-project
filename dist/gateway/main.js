"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const gateway_module_1 = require("./gateway.module");
const share_1 = require("@my-msa-project/share");
async function bootstrap() {
    const app = await core_1.NestFactory.create(gateway_module_1.GatewayModule, { logger: false });
    // 1) 커스텀 로거 적용
    app.useLogger(new share_1.CustomLoggerService());
    // 2) 전역 예외 필터 적용
    app.useGlobalFilters(new share_1.AllExceptionsFilter());
    const port = process.env.PORT || 3000;
    await app.listen(port);
}
bootstrap();
