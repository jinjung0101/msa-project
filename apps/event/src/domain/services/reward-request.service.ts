import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import {
  REWARD_REQUEST_REPOSITORY,
  RewardRequestRepositoryPort,
} from "../ports/reward-request.repository.port";
import { RewardRequestZodModel } from "@my-msa-project/share/schemas/event/reward-request.schema";
import { ConditionService } from "./condition.service";
import { ConditionValidatorService } from "./condition-validator.service";

@Injectable()
export class RewardRequestService {
  constructor(
    @Inject(REWARD_REQUEST_REPOSITORY)
    private repo: RewardRequestRepositoryPort,

    private readonly conditionService: ConditionService,
    private readonly validator: ConditionValidatorService
  ) {}

  async create(req: RewardRequestZodModel) {
    if (await this.repo.existsPendingOrApproved(req.userId!, req.eventId!)) {
      throw new BadRequestException("이미 요청된 이벤트입니다");
    }
    const conds = await this.conditionService.findByEvent(req.eventId!);
    await this.validator.validateAll(req.userId!, conds);
    return this.repo.create({ ...req, status: "pending" });
  }

  findByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  findAll(filter?: { eventId?: string; status?: string }) {
    return this.repo.findAll(filter);
  }
}
