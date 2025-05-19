import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedMongooseModule } from "infrastructure/mongoose.module";
import { ConditionBaseSchema } from "./persistence/schemas/condition/condition.base.entity";
import { ConditionDiscriminatorProvider } from "./persistence/schemas/condition/condition.discriminator";
import { RewardDefinitionBaseSchema } from "./persistence/schemas/reward-definition/reward-definition.base.entity";
import { RewardDefinitionDiscriminatorProvider } from "./persistence/schemas/reward-definition/reward-definition.discriminator";
import { EventEntity, EventSchema } from "./persistence/schemas/event.entity";
import {
  RewardEntity,
  RewardSchema,
} from "./persistence/schemas/reward.entity";
import {
  RewardRequestEntity,
  RewardRequestSchema,
} from "./persistence/schemas/rewardRequest.entity";
import {
  LoginLogEntity,
  LoginLogSchema,
} from "./persistence/schemas/login-log.entity";

@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([
      { name: "Condition", schema: ConditionBaseSchema },
      { name: "RewardDefinition", schema: RewardDefinitionBaseSchema },
      { name: EventEntity.name, schema: EventSchema },
      { name: RewardEntity.name, schema: RewardSchema },
      { name: RewardRequestEntity.name, schema: RewardRequestSchema },
      { name: LoginLogEntity.name, schema: LoginLogSchema },
    ]),
  ],
  providers: [
    ConditionDiscriminatorProvider,
    RewardDefinitionDiscriminatorProvider,
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
