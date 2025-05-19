import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { EventProxyService } from "./event.proxy.service";
import { ConfigModule } from "@nestjs/config";
import { EventController } from "./event.controller";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [EventProxyService],
  controllers: [EventController],
})
export class EventModule {}
