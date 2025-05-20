import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedMongooseModule } from "infrastructure/mongoose.module";
import { UserEntity, UserSchema } from "../persistence/schemas/user.entity";
import {
  SessionDoc,
  SessionSchema,
} from "../persistence/schemas/session.entity";

@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: SessionDoc.name, schema: SessionSchema },
    ]),
  ],
  providers: [],
  exports: [MongooseModule, SharedMongooseModule],
})
export class DatabaseModule {}
