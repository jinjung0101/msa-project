import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { RolesGuard } from "@my-msa-project/share/security/roles.guard";
import { SharedJwtStrategy } from "@my-msa-project/share/security/base-jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule, // downstream 서비스 호출용
  ],
  controllers: [],
  providers: [
    SharedJwtStrategy,
    { provide: APP_GUARD, useClass: AuthGuard("jwt") }, // JwtAuthGuard 역할
    { provide: APP_GUARD, useClass: RolesGuard }, // 전역 RolesGuard
  ],
})
export class GatewayModule {}
