import { RewardZodModel } from "@my-msa-project/share/schemas/event/reward.schema";

export const REWARD_REPOSITORY = Symbol("REWARD_REPOSITORY");

export interface RewardRepositoryPort {
  create(reward: RewardZodModel): Promise<string>;

  findAll(filter?: {
    userId?: string;
    eventId?: string;
  }): Promise<(RewardZodModel & { id: string })[]>;
}
