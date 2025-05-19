import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import {
  REWARD_REQUEST_REPOSITORY,
  RewardRequestRepositoryPort,
} from "../ports/reward-request.repository.port";
import { RewardRequestZodModel } from "@my-msa-project/share/schemas/event/reward-request.schema";
import { ConditionService } from "./condition.service";

@Injectable()
export class RewardRequestService {
  constructor(
    @Inject(REWARD_REQUEST_REPOSITORY)
    private repo: RewardRequestRepositoryPort,
    private readonly conditionService: ConditionService
  ) {}

  async create(req: RewardRequestZodModel) {
    // 1) 중복 방지
    if (await this.repo.existsPendingOrApproved(req.userId, req.eventId)) {
      throw new BadRequestException("이미 요청된 이벤트입니다");
    }
    // 2) 조건 검증
    const conds = await this.conditionService.findByEvent(req.eventId);
    for (const cond of conds) {
      switch (cond.type) {
        case "loginStreak":
          if (
            !(await this.conditionService.validateLoginStreak(
              req.userId,
              cond.parameters.days
            ))
          ) {
            throw new BadRequestException(
              `로그인 연속 일수 ${cond.parameters.days}일 조건을 충족하지 못했습니다`
            );
          }
          break;
        case "inviteFriends":
          break;
        case "custom":
          break;
        default:
          throw new BadRequestException(`알 수 없는 조건 타입: ${cond}`);
      }
    }

    return this.repo.create({ ...req, status: "pending" });
  }

  findByUser(userId: string) {
    return this.repo.findByUser(userId);
  }

  findAll(filter?: { eventId?: string; status?: string }) {
    return this.repo.findAll(filter);
  }
}
