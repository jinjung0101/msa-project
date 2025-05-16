import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
