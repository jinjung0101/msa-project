import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import {
  CreateEventDto,
} from "@my-msa-project/share/schemas/event/create-event.schema";
import {
  EventResponseDto,
} from "@my-msa-project/share/schemas/event/event-response.schema";
import {
  RewardDefinitionZodModel,
} from "@my-msa-project/share/schemas/event/reward-definition.schema";
import { BaseProxyService } from "../../common/base-proxy.service";

@Injectable()
export class EventProxyService extends BaseProxyService {
  constructor(http: HttpService, config: ConfigService) {
    const url = config.get<string>("EVENT_SERVICE_URL");
   if (!url) throw new Error("EVENT_SERVICE_URL이 설정되지 않았습니다");
   super(http, url);
  }

  getEvents(token: string): Promise<EventResponseDto[]> {
    return this.get<EventResponseDto[]>("/events", token);
  }

  getEventById(eventId: string, token: string): Promise<EventResponseDto> {
    return this.get<EventResponseDto>(`/events/${eventId}`, token);
  }

  createEvent(dto: CreateEventDto, token: string): Promise<EventResponseDto> {
    return this.post<EventResponseDto, CreateEventDto>("/events", dto, token);
  }

  updateEventStatus(
    eventId: string,
    status: EventResponseDto["status"],
    token: string
  ): Promise<EventResponseDto> {
    return this.patch<EventResponseDto, { status: EventResponseDto["status"] }>(
      `/events/${eventId}/status`,
      { status },
      token
    );
  }

  deleteEvent(eventId: string, token: string): Promise<void> {
    return this.delete<void>(`/events/${eventId}`, token);
  }

  getRewardDefinitions(
    eventId: string,
    token: string
  ): Promise<RewardDefinitionZodModel[]> {
    return this.get<RewardDefinitionZodModel[]>(
      `/events/${eventId}/reward-definitions`,
      token
    );
  }
}
