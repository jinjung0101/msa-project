import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  jti: string;
}

@Injectable()
export class SharedJwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(protected readonly config: ConfigService<unknown, boolean>) {
    const secret = config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("환경변수 JWT_SECRET이 설정되지 않았습니다");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  /** 서명과 exp 만 체크, payload 그대로 반환 */
  async validate(payload: JwtPayload): Promise<unknown> {
    return payload;
  }
}
