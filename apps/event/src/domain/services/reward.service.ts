import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { RewardZodModel } from "@my-msa-project/share/schemas/event/reward.schema";
import { REWARD_REPOSITORY, RewardRepositoryPort } from "../ports/reward.repository.port";

@Injectable()
export class RewardService {
  constructor(
    @Inject(REWARD_REPOSITORY)
    private readonly rewardRepo: RewardRepositoryPort
  ) {}

  /** 보상 지급 저장 */
  async issueReward(dto: RewardZodModel): Promise<string> {
    return this.rewardRepo.create(dto);
  }

  /** 지급 내역 조회 (감사자 전용) */
  async listRewards(filter?: {
    userId?: string;
    eventId?: string;
  }): Promise<(RewardZodModel & { id: string })[]> {
    return this.rewardRepo.findAll(filter);
  }
}
