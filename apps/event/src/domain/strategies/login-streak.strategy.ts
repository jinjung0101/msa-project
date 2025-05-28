import { Inject, Injectable } from "@nestjs/common";
import { ConditionStrategy } from "./condition.strategy";
import { LoginStreakParamsDto } from "../../controllers/dtos/condition-definition.request.dto";
import {
  LOGIN_LOG_REPOSITORY,
  LoginLogRepositoryPort,
} from "../ports/login-log.repository.port";

@Injectable()
export class LoginStreakStrategy implements ConditionStrategy {
  constructor(
    @Inject(LOGIN_LOG_REPOSITORY)
    private readonly logRepo: LoginLogRepositoryPort
  ) {}
  supports(type: string) {
    return type === "loginStreak";
  }
  async validate(userId: string, params: LoginStreakParamsDto) {
    const streak = await this.logRepo.countConsecutiveDays(userId);
    return streak >= params.days;
  }
}
