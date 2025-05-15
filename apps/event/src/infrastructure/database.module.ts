import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedMongooseModule } from 'infrastructure/mongoose.module';

import { ConditionBaseSchema }            from '../adapters/persistence/schemas/condition/base.entity';
import { ConditionDiscriminatorProvider } from '../adapters/persistence/schemas/condition/condition.discriminator';

import { RewardDefinitionBaseSchema }            from '../adapters/persistence/schemas/reward-definition/base.entity';
import { RewardDefinitionDiscriminatorProvider } from '../adapters/persistence/schemas/reward-definition/reward-definition.discriminator';

import { EventEntity, EventSchema }           from '../adapters/persistence/schemas/event.entity';
import { RewardEntity, RewardSchema }         from '../adapters/persistence/schemas/reward.entity';
import { RewardRequestEntity, RewardRequestSchema } from '../adapters/persistence/schemas/rewardRequest.entity';


@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([
      { name: 'Condition',        schema: ConditionBaseSchema },
      { name: 'RewardDefinition', schema: RewardDefinitionBaseSchema },
      { name: EventEntity.name,   schema: EventSchema },
      { name: RewardEntity.name,  schema: RewardSchema },
      { name: RewardRequestEntity.name, schema: RewardRequestSchema },
    ]),
  ],
  providers: [
    ConditionDiscriminatorProvider,
    RewardDefinitionDiscriminatorProvider,
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
