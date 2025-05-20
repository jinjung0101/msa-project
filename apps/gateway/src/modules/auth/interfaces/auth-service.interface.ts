import {
  RegisterUserDto,
  LoginUserDto,
  AssignRoleDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

export interface GatewayAuthService {
  register(dto: RegisterUserDto): Promise<UserResponseDto>;

  login(dto: LoginUserDto): Promise<{ accessToken: string }>;

  assignRole(
    username: string,
    dto: AssignRoleDto,
    token: string
  ): Promise<UserResponseDto>;
}
