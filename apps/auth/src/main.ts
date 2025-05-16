import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import {
  CustomLoggerService,
  AllExceptionsFilter,
} from "@my-msa-project/share";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, { logger: false });

  // 1) 커스텀 로거 적용
  app.useLogger(new CustomLoggerService());

  // 2) 전역 예외 필터 적용
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3) Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Auth API")
    .setDescription("User registration, login, role management")
    .setVersion("1.0")
    // 기본 Bearer auth 스키마 등록 (Swagger UI 상단에 토큰 입력창 생성)
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
