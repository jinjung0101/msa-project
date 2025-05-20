export const SESSION_REPOSITORY = Symbol("SESSION_REPOSITORY");

export interface SessionEntity {
  userId: string;
  jti: string;
  expiresAt: Date;
}

export interface SessionRepositoryPort {
  /** userId 로 세션 조회 */
  findByUserId(userId: string): Promise<SessionEntity | null>;

  /** 세션 upsert */
  upsert(session: SessionEntity): Promise<void>;

  /** 세션 삭제 */
  deleteByUserId(userId: string): Promise<void>;
}
