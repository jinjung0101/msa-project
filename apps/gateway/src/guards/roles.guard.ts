import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<UserRoleEnum[]>(
      ROLES_KEY,
      ctx.getHandler()
    );
    if (!required) return true;

    const user = ctx.switchToHttp().getRequest().user as { role: UserRoleEnum };
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException("권한이 없습니다");
    }
    return true;
  }
}
