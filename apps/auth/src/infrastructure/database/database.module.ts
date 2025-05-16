import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedMongooseModule } from "infrastructure/mongoose.module";
import { UserEntity, UserSchema } from "../persistence/schemas/user.entity";

@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  providers: [],
  exports: [MongooseModule, SharedMongooseModule],
})
export class DatabaseModule {}
