import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserRoleEnum } from "../schemas/auth/user-role.schema";
import { UserResponseDto } from "../schemas/auth/user.schema";

@Injectable()
export class SharedJwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("환경변수 JWT_SECRET이 설정되지 않았습니다");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    role: UserRoleEnum;
  }): Promise<UserResponseDto> {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
