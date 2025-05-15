import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./adapters/persistence/repositories/event.repository";
import { DatabaseModule } from "./infrastructure/database.module";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "infrastructure/pipes/zod-validation.pipe";

@Module({
  imports: [DatabaseModule],
  controllers: [EventController, EventRepository],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    EventService,
    EventRepository,
  ],
})
export class EventModule {}
