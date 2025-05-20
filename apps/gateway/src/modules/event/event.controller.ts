import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Headers,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { EventProxyService } from "./event.proxy.service";
import { CreateEventDto } from "@my-msa-project/share/schemas/event/create-event.schema";

@Controller("events")
@UseGuards(AuthGuard("jwt"))
export class EventController {
  constructor(private readonly proxy: EventProxyService) {}

  @Get()
  findAll(@Headers("authorization") authHeader: string) {
    const token = authHeader.split(" ")[1];
    return this.proxy.getEvents(token);
  }

  @Get(":id")
  findOne(
    @Headers("authorization") authHeader: string,
    @Param("id") id: string
  ) {
    const token = authHeader.split(" ")[1];
    return this.proxy.getEventById(id, token);
  }

  @Post()
  create(
    @Headers("authorization") authHeader: string,
    @Body() dto: CreateEventDto
  ) {
    const token = authHeader.split(" ")[1];
    return this.proxy.createEvent(dto, token);
  }

  @Patch(":id/status")
  updateStatus(
    @Headers("authorization") authHeader: string,
    @Param("id") id: string,
    @Body("status") status: "active" | "inactive"
  ) {
    const token = authHeader.split(" ")[1];
    return this.proxy.updateEventStatus(id, status, token);
  }

  @Delete(":id")
  remove(
    @Headers("authorization") authHeader: string,
    @Param("id") id: string
  ) {
    const token = authHeader.split(" ")[1];
    return this.proxy.deleteEvent(id, token);
  }

  @Get(":id/reward-definitions")
  rewardDefs(
    @Headers("authorization") authHeader: string,
    @Param("id") id: string
  ) {
    const token = authHeader.split(" ")[1];
    return this.proxy.getRewardDefinitions(id, token);
  }
}
