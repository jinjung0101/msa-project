import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "../domain/services/auth.service";
import { ZodValidationPipe } from "infrastructure/pipes/zod-validation.pipe";
import {
  LoginUserDto,
  LoginUserSchema,
  RegisterUserDto,
  RegisterUserSchema,
  UserResponseDto,
  AssignRoleDto,
  AssignRoleSchema,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { UserResponseDto as UserResponseClass } from "./dtos/user-response.dto";
import { AccessTokenDto } from "./dtos/access-token.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@my-msa-project/share/security/roles.guard";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { Roles } from "@my-msa-project/share/security/roles.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "회원가입" })
  @ApiResponse({ status: 201, type: UserResponseClass })
  register(
    @Body(new ZodValidationPipe(RegisterUserSchema)) dto: RegisterUserDto
  ): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "로그인(Login) 및 JWT 발급" })
  @ApiResponse({ status: 200, type: AccessTokenDto })
  async login(
    @Body(new ZodValidationPipe(LoginUserSchema)) dto: LoginUserDto
  ): Promise<AccessTokenDto> {
    const { accessToken } = await this.authService.login(dto);
    return new AccessTokenDto({ accessToken });
  }

  @Patch("logout")
  @ApiOperation({ summary: "로그아웃" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  logout(@Req() req: Request & { user: { sub: string } }): Promise<void> {
    return this.authService.logout(req.user.sub);
  }

  @Patch("users/:username/role")
  @ApiOperation({ summary: "사용자 롤 변경", description: "ADMIN 전용" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiResponse({ status: 200, type: UserResponseClass })
  @ApiResponse({ status: 404, description: "사용자 없음" })
  assignRole(
    @Param("username") username: string,
    @Body(new ZodValidationPipe(AssignRoleSchema)) dto: AssignRoleDto
  ): Promise<UserResponseDto> {
    const { role } = dto;
    return this.authService.assignRole(username, role!);
  }

  @Get("me")
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard("jwt"))
  getProfile(
    @Req() req: Request & { user: { sub: string } }
  ): Promise<UserResponseDto> {
    return this.authService.getUserById(req.user.sub);
  }

  @Get("users")
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.AUDITOR)
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.getAllUsers();
  }
}
