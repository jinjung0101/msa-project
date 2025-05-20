import { Injectable, BadRequestException } from "@nestjs/common";
import { ConditionStrategy } from "../strategies/condition.strategy";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";

@Injectable()
export class ConditionValidatorService {
  constructor(private readonly strategies: ConditionStrategy[]) {}

  async validateAll(userId: string, conds: ConditionDefinitionZodModel[]) {
    for (const c of conds) {
      const strat = this.strategies.find((s) => s.supports(c.type));
      if (!strat)
        throw new BadRequestException(`지원되지 않는 조건 타입: ${c.type}`);
      const ok = await strat.validate(userId, c.parameters);
      if (!ok)
        throw new BadRequestException(`${c.type} 조건을 충족하지 못했습니다`);
    }
  }
}
