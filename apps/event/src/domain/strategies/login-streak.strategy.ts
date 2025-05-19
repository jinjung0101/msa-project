import { Injectable } from "@nestjs/common";
import { ConditionStrategy } from "./condition.strategy";
import { LoginStreakParamsDto } from "../../controllers/dtos/condition-definition.request.dto";
import { LoginLogRepositoryPort } from "../ports/login-log.repository.port";

@Injectable()
export class LoginStreakStrategy implements ConditionStrategy {
  constructor(private readonly logRepo: LoginLogRepositoryPort) {}
  supports(type: string) { return type === "loginStreak"; }
  async validate(userId: string, params: LoginStreakParamsDto) {
    const streak = await this.logRepo.countConsecutiveDays(userId);
    return streak >= params.days;
  }
}
