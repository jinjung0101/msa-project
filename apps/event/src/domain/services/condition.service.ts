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
    return this.conditionRepo.findByEvent(eventId);
  }

  /**
   * 로그인 연속 일수 검증: 마지막 days일 동안 연속으로 로그인했는지 확인
   */
  async validateLoginStreak(userId: string, days: number): Promise<boolean> {
    // 1) 시작·끝 날짜를 한 번만 계산
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);

    // 2) 해당 범위의 로그인 기록을 한 번에 조회
    const dates = await this.loginLogRepo.findLoginDates(userId, start, end);

    // 3) 메모리에서 연속성 검사
    const daySet = new Set(dates.map((d) => d.toDateString()));
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      if (!daySet.has(d.toDateString())) return false;
    }
    return true;
  }

  /** 친구 초대 조건 검증 (구현 X) */
  async validateInviteFriends(userId: string, count: number): Promise<boolean> {
    // inviteFriends 로직을 여기에 추가
    return true; // TODO
  }

  /** custom 조건 검증 (구현 X) */
  async validateCustom(
    userId: string,
    parameters: Record<string, unknown>
  ): Promise<boolean> {
    // 커스텀 로직
    return true; // TODO
  }
}
