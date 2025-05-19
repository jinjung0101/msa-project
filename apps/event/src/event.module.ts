import { Module } from "@nestjs/common";
import { DatabaseModule } from "./infrastructure/database.module";
import { APP_GUARD } from "@nestjs/core";
import { EventsController } from "./controllers/events.controller";
import { EventService } from "./domain/services/event.service";
import { EVENT_REPOSITORY } from "./domain/ports/event.repository.port";
import { EventRepositoryAdapter } from "./infrastructure/persistence/repositories/event.repository.adapter";
import { ConfigModule } from "@nestjs/config";
import { SharedJwtStrategy } from "@my-msa-project/share/security/jwt.strategy";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { ConditionService } from "./domain/services/condition.service";
import { ConditionRepositoryAdapter } from "./infrastructure/persistence/repositories/condition.repository.adapter";
import { CONDITION_REPOSITORY } from "./domain/ports/condition.repository.port";
import { RewardDefinitionService } from "./domain/services/reward-definition.service";
import { REWARD_DEFINITION_REPOSITORY } from "./domain/ports/reward-definition.repository.port";
import { RewardDefinitionRepositoryAdapter } from "./infrastructure/persistence/repositories/reward-definition.repository.adapter";
import { RolesGuard } from "@my-msa-project/share/security/roles.guard";
import { RewardDefinitionsController } from "./controllers/reward-definitions.controller";
import { REWARD_REQUEST_REPOSITORY } from "./domain/ports/reward-request.repository.port";
import { RewardRequestRepositoryAdapter } from "./infrastructure/persistence/repositories/reward-request.repository.adapter";
import { RewardRequestService } from "./domain/services/reward-request.service";
import { RewardRequestsController } from "./controllers/reward-requests.controller";
import { LOGIN_LOG_REPOSITORY } from "./domain/ports/login-log.repository.port";
import { LoginLogRepositoryAdapter } from "./infrastructure/persistence/repositories/login-log.repository.adapter";
import { REWARD_REPOSITORY } from "./domain/ports/reward.repository.port";
import { RewardRepositoryAdapter } from "./infrastructure/persistence/repositories/reward.repository.adapter";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [
    EventsController,
    RewardDefinitionsController,
    RewardRequestsController,
  ],
  providers: [
    SharedJwtStrategy,
    { provide: APP_GUARD, useClass: AuthGuard("jwt") },
    { provide: APP_GUARD, useClass: RolesGuard },
    EventService,
    { provide: EVENT_REPOSITORY, useClass: EventRepositoryAdapter },
    ConditionService,
    { provide: REWARD_REPOSITORY, useClass: RewardRepositoryAdapter },
    { provide: CONDITION_REPOSITORY, useClass: ConditionRepositoryAdapter },
    RewardDefinitionService,
    {
      provide: REWARD_DEFINITION_REPOSITORY,
      useClass: RewardDefinitionRepositoryAdapter,
    },
    {
      provide: REWARD_REQUEST_REPOSITORY,
      useClass: RewardRequestRepositoryAdapter,
    },
    { provide: LOGIN_LOG_REPOSITORY, useClass: LoginLogRepositoryAdapter },
    RewardRequestService,
  ],
})
export class EventModule {}
