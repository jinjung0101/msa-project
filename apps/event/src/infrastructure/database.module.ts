import { Module } from "@nestjs/common";
import { SharedMongooseModule } from "infrastructure/mongoose.module";
import { MongooseModule } from "@nestjs/mongoose";
import {
  EventEntity,
  EventSchema,
} from "../adapters/persistence/schemas/event.entity";
import {
  RewardEntity,
  RewardSchema,
} from "../adapters/persistence/schemas/reward.entity";

@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
      { name: RewardEntity.name, schema: RewardSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
