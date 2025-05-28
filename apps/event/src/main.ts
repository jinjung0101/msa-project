import { NestFactory } from "@nestjs/core";
import { EventModule } from "./event.module";
import {
  CustomLoggerService,
  AllExceptionsFilter,
} from "@my-msa-project/share";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(EventModule, {
    logger: ["log", "warn", "error", "debug"],
  });

  // 1) 커스텀 로거 적용
  app.useLogger(new CustomLoggerService());

  // 2) 전역 예외 필터 적용
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3) Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Event API")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.EVENT_PORT || 3002;
  await app.listen(port);
}
bootstrap();
