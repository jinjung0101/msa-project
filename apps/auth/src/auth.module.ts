import { Module } from "@nestjs/common";
import { UserRepositoryAdapter } from "./adapters/persistence/user.repository";
import { AuthService } from "./domain/services/auth.service";
import { DatabaseModule } from "./infrastructure/database.module";
import { USER_REPOSITORY } from "./domain/ports/user.repository.port";
import { AuthController } from "./controllers/auth.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
    AuthService,
  ],
})
export class AuthModule {}
