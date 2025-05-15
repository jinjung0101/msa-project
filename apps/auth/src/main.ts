import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import {
  CustomLoggerService,
  AllExceptionsFilter,
} from "@my-msa-project/share";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, { logger: false });

  // 1) 커스텀 로거 적용
  app.useLogger(new CustomLoggerService());

  // 2) 전역 예외 필터 적용
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
