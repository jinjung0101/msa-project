import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class SharedMongooseModule {}
