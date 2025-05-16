import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepositoryPort {
  create(
    input: Omit<RegisterUserDto, "password"> & {
      passwordHash: string;
      role?: UserRoleEnum;
    }
  ): Promise<UserResponseDto>;

  existsByUsername(username: string): Promise<boolean>;

  findByUsername(username: string): Promise<UserResponseDto | null>;

  findUserWithHash(
    username: string
  ): Promise<(UserResponseDto & { passwordHash: string }) | null>;

  updateRole(userId: string, role: UserRoleEnum): Promise<UserResponseDto>;
}
