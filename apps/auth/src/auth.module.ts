import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserRepositoryAdapter } from "./infrastructure/persistence/user.repository";
import { AuthService } from "./domain/services/auth.service";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { USER_REPOSITORY } from "./domain/ports/user.repository.port";
import { AuthController } from "./controllers/auth.controller";
import { HASHING_SERVICE } from "./domain/services/hashing.service";
import { BcryptHashingService } from "./infrastructure/hashing/bcrypt-hashing.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { SESSION_REPOSITORY } from "./domain/ports/session.repository.port";
import { SessionRepositoryAdapter } from "./infrastructure/persistence/session.repository";
import { AuthJwtStrategy } from "./infrastructure/strategies/auth-jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
    { provide: HASHING_SERVICE, useClass: BcryptHashingService },
    { provide: SESSION_REPOSITORY, useClass: SessionRepositoryAdapter },
    AuthJwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
