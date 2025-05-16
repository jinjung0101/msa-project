import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedMongooseModule } from "infrastructure/mongoose.module";
import {
  UserEntity,
  UserSchema,
} from "../adapters/persistence/schemas/user.entity";

@Module({
  imports: [
    SharedMongooseModule,
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
