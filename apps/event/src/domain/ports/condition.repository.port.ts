import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";

export const CONDITION_REPOSITORY = Symbol("CONDITION_REPOSITORY");

export interface ConditionRepositoryPort {
  bulkCreate(conds: ConditionDefinitionZodModel[]): Promise<string[]>;

  findByEvent(eventId: string): Promise<ConditionDefinitionZodModel[]>;
}
