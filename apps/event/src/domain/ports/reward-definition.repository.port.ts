import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";

export const REWARD_DEFINITION_REPOSITORY = Symbol(
  "REWARD_DEFINITION_REPOSITORY"
);

export interface RewardDefinitionRepositoryPort {
  bulkCreate(rdefs: RewardDefinitionZodModel[]): Promise<string[]>;

  findByEvent(eventId: string): Promise<RewardDefinitionZodModel[]>;
}
