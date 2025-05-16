import { Module } from "@nestjs/common";
import { UserRepositoryAdapter } from "./infrastructure/persistence/user.repository";
import { AuthService } from "./domain/services/auth.service";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { USER_REPOSITORY } from "./domain/ports/user.repository.port";
import { AuthController } from "./controllers/auth.controller";
import {
  HASHING_SERVICE,
  HashingService,
} from "./domain/services/hashing.service";
import { BcryptHashingService } from "./infrastructure/hashing/bcrypt-hashing.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
    { provide: HASHING_SERVICE, useClass: BcryptHashingService },
    AuthService,
  ],
})
export class AuthModule {}
