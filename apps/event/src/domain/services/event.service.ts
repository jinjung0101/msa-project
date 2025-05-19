import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  EVENT_REPOSITORY,
  EventRepositoryPort,
} from "../ports/event.repository.port";
import { EventZodModel } from "@my-msa-project/share/schemas/event/event.schema";
import { CreateEventDto } from "@my-msa-project/share/schemas/event/create-event.schema";
import { ConditionService } from "./condition.service";
import { RewardDefinitionService } from "./reward-definition.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { EventResponseDto } from "@my-msa-project/share/schemas/event/event-response.schema";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";
import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY) private repo: EventRepositoryPort,
    private readonly conditionService: ConditionService,
    private readonly rewardDefService: RewardDefinitionService,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(dto: CreateEventDto) {
    const session = await this.connection.startSession();
    return session.withTransaction(async () => {
      // 조건 없이 빈 배열로 이벤트 먼저 생성
      const event: EventResponseDto = await this.repo.create({
        ...dto,
        conditions: [],
        rewardDefinitions: [],
      });

      // 타입을 명시해 주면, TS가 literal 타입을 놓치지 않고 추론함
      const conds: ConditionDefinitionZodModel[] = dto.conditions.map((c) => ({
        ...c,
        eventId: event.id,
      }));
      const condIds = await this.conditionService.bulkCreate(conds);

      const rdefs: RewardDefinitionZodModel[] = dto.rewardDefinitions.map(
        (r) => ({ ...r, eventId: event.id })
      );
      const rdefIds = await this.rewardDefService.bulkCreate(rdefs);

      // EventResponseDto 형태로 업데이트
      return this.repo.update(event.id, {
        ...event,
        conditions: condIds,
        rewardDefinitions: rdefIds,
      });
    });
  }

  async list(): Promise<EventResponseDto[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<EventResponseDto> {
    const event = await this.repo.findById(id);
    if (!event) {
      throw new NotFoundException(`EVENT_ID=${id}를 찾을 수 없습니다.`);
    }
    return event;
  }

  deactivate(id: string): Promise<void> {
    return this.repo.deactivate(id);
  }
}
