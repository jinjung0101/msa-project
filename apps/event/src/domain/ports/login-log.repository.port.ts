export const LOGIN_LOG_REPOSITORY = Symbol("LOGIN_LOG_REPOSITORY");

export interface LoginLogRepositoryPort {
  /**
   * 주어진 기간 내 특정 유저의 로그인 기록 날짜 목록을 반환
   */
  findLoginDates(userId: string, start: Date, end: Date): Promise<Date[]>;
}
