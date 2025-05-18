import { NestFactory } from "@nestjs/core";
import { GatewayModule } from "./gateway.module";
import {
  CustomLoggerService,
  AllExceptionsFilter,
} from "@my-msa-project/share";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { logger: false });

  // 1) 커스텀 로거 적용
  app.useLogger(new CustomLoggerService());

  // 2) 전역 예외 필터 적용
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle("API Gateway")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);
}
bootstrap();
