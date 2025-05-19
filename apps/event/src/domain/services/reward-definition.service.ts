import { Inject, Injectable } from "@nestjs/common";
import {
  REWARD_DEFINITION_REPOSITORY,
  RewardDefinitionRepositoryPort,
} from "../ports/reward-definition.repository.port";
import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";

@Injectable()
export class RewardDefinitionService {
  constructor(
    @Inject(REWARD_DEFINITION_REPOSITORY)
    private readonly rewardDefRepo: RewardDefinitionRepositoryPort
  ) {}

  /**
   * 여러 개의 보상 정의를 한 번에 생성하고, 생성된 ObjectId 문자열 배열을 반환
   */
  bulkCreate(rdefs: RewardDefinitionZodModel[]): Promise<string[]> {
    return this.rewardDefRepo.bulkCreate(rdefs);
  }

  /**
   * 특정 이벤트의 모든 보상 정의를 조회 (추가 기능)
   */
  async findByEvent(eventId: string): Promise<RewardDefinitionZodModel[]> {
    return this.rewardDefRepo.findByEvent(eventId);
  }
}
