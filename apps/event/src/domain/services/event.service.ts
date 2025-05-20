import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EVENT_REPOSITORY,
  EventRepositoryPort,
} from "../ports/event.repository.port";
import { CreateEventDto } from "@my-msa-project/share/schemas/event/create-event.schema";
import { ConditionService } from "./condition.service";
import { RewardDefinitionService } from "./reward-definition.service";
import { EventResponseDto } from "@my-msa-project/share/schemas/event/event-response.schema";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";
import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";
import {
  TRANSACTION_MANAGER,
  TransactionManagerPort,
} from "../ports/transaction-manager.port";

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY) private repo: EventRepositoryPort,
    private readonly conditionService: ConditionService,
    private readonly rewardDefService: RewardDefinitionService,
    @Inject(TRANSACTION_MANAGER) private transaction: TransactionManagerPort
  ) {}

  async create(dto: CreateEventDto) {
    return this.transaction.withTransaction(async () => {
      // 1) 필수 속성 검사
      if (!dto.conditions?.length) {
        throw new BadRequestException("조건은 최소 1개 이상이어야 합니다");
      }
      if (!dto.rewardDefinitions?.length) {
        throw new BadRequestException("보상 정의는 최소 1개 이상이어야 합니다");
      }

      // 2) 이벤트 생성
      const event = await this.repo.create({
        ...dto,
        conditions: [],
        rewardDefinitions: [],
      });

      // 3) 매핑
      const conds = dto.conditions.map((c) => ({ ...c, eventId: event.id }));
      const condIds = await this.conditionService.bulkCreate(conds);

      const rdefs = dto.rewardDefinitions.map((r) => ({
        ...r,
        eventId: event.id,
      }));
      const rdefIds = await this.rewardDefService.bulkCreate(rdefs);

      // 4) 업데이트
      return this.repo.update(event.id!, {
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
