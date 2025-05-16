import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepositoryPort {
  create(
    input: Omit<RegisterUserDto, "password"> & { passwordHash: string }
  ): Promise<UserResponseDto>;

  existsByUsername(username: string): Promise<boolean>;

  findByUsername(
    username: string
  ): Promise<(UserResponseDto & { passwordHash: string }) | null>;
}
