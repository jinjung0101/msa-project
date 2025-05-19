import { RewardRequestZodModel } from "@my-msa-project/share/schemas/event/reward-request.schema";

export const REWARD_REQUEST_REPOSITORY = Symbol("REWARD_REQUEST_REPOSITORY");

export interface RewardRequestRepositoryPort {
  existsPendingOrApproved(userId: string, eventId: string): Promise<boolean>;

  create(req: RewardRequestZodModel): Promise<string>;

  findByUser(
    userId: string
  ): Promise<(RewardRequestZodModel & { id: string })[]>;

  findAll(filter?: {
    eventId?: string;
    status?: string;
  }): Promise<(RewardRequestZodModel & { id: string })[]>;
}
