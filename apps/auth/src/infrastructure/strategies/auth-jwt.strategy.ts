import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SharedJwtStrategy,
  JwtPayload,
} from "@my-msa-project/share/security/base-jwt.strategy";
import {
  SESSION_REPOSITORY,
  SessionRepositoryPort,
} from "../../domain/ports/session.repository.port";
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from "../../domain/ports/user.repository.port";
import { UserResponseDto } from "@my-msa-project/share/schemas/auth/user.schema";

@Injectable()
export class AuthJwtStrategy extends SharedJwtStrategy {
  constructor(
    config: ConfigService<unknown, boolean>,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort
  ) {
    super(config);
  }

  /** 서명 검증 후, DB 세션 검증 및 사용자 조회 */
  async validate(payload: JwtPayload): Promise<UserResponseDto> {
    // 1) 세션 일치 확인
    const session = await this.sessionRepo.findByUserId(payload.sub);
    if (
      !session ||
      session.jti !== payload.jti ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedException("유효하지 않은 세션입니다.");
    }

    // 2) 실제 사용자 DTO 반환
    return this.userRepo.findById(payload.sub);
  }
}
