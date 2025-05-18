import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseProxyService } from "../../common/base-proxy.service";
import { GatewayAuthService } from "./interfaces/auth-service.interface";
import {
  RegisterUserDto,
  LoginUserDto,
  AssignRoleDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

@Injectable()
export class AuthService
  extends BaseProxyService
  implements GatewayAuthService
{
  constructor(http: HttpService) {
    super(http, process.env.AUTH_SERVICE_URL!);
  }

  register(dto: RegisterUserDto): Promise<UserResponseDto> {
    return this.post<UserResponseDto, RegisterUserDto>("/auth/register", dto, "");
  }

  login(dto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.post<{ accessToken: string }, LoginUserDto>("/auth/login", dto, "");
  }

  assignRole(
    username: string,
    dto: AssignRoleDto,
    token: string
  ): Promise<UserResponseDto> {
    return this.post<UserResponseDto, AssignRoleDto>(
      `/auth/users/${username}/role`,
      dto,
      token
    );
  }
}
