import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI, {})],
  exports: [MongooseModule],
})
export class SharedMongooseModule {}
