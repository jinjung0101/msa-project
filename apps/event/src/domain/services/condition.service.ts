import { Inject, Injectable } from "@nestjs/common";
import {
  CONDITION_REPOSITORY,
  ConditionRepositoryPort,
} from "../ports/condition.repository.port";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";
import {
  LOGIN_LOG_REPOSITORY,
  LoginLogRepositoryPort,
} from "../ports/login-log.repository.port";

@Injectable()
export class ConditionService {
  constructor(
    @Inject(CONDITION_REPOSITORY)
    private readonly conditionRepo: ConditionRepositoryPort,
    @Inject(LOGIN_LOG_REPOSITORY)
    private readonly loginLogRepo: LoginLogRepositoryPort
  ) {}

  /**
   * 여러 개의 조건을 한 번에 생성하고, 생성된 ObjectId 문자열 배열을 반환
   */
  bulkCreate(conds: ConditionDefinitionZodModel[]): Promise<string[]> {
    return this.conditionRepo.bulkCreate(conds);
  }

  /**
   * 특정 이벤트의 모든 조건을 조회 (추가 기능)
   */
  async findByEvent(eventId: string): Promise<ConditionDefinitionZodModel[]> {
    // repository에 findByEvent 메서드가 없다면, 추가 정의 후 구현하세요.
    return this.conditionRepo.findByEvent(eventId);
  }

  /**
   * 로그인 연속 일수 검증: 마지막 days일 동안 연속으로 로그인했는지 확인
   */
  async validateLoginStreak(userId: string, days: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - (days - 1));

    // 조건 기간 내 로그인 날짜 목록 조회
    const dates = await this.loginLogRepo.findLoginDates(
      userId,
      start,
      new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
    );

    // 연속 일수 체크
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(start.getDate() + i);
      const found = dates.some(
        (d) =>
          d.getFullYear() === checkDate.getFullYear() &&
          d.getMonth() === checkDate.getMonth() &&
          d.getDate() === checkDate.getDate()
      );
      if (!found) return false;
    }
    return true;
  }
}
