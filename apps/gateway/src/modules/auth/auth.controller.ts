import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Headers 
} from "@nestjs/common";
import {
  RegisterUserSchema,
  RegisterUserDto,
  LoginUserSchema,
  LoginUserDto,
  AssignRoleSchema,
  AssignRoleDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../guards/roles.decorator";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { ZodValidationPipe } from "infrastructure/pipes/zod-validation.pipe";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body(new ZodValidationPipe(RegisterUserSchema))
    dto: RegisterUserDto
  ): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @Post("login")
  login(
    @Body(new ZodValidationPipe(LoginUserSchema))
    dto: LoginUserDto
  ): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }

  @Patch("users/:username/role")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  assignRole(
    @Headers("authorization") authHeader: string,
    @Param("username") username: string,
    @Body(new ZodValidationPipe(AssignRoleSchema))
    dto: AssignRoleDto
  ): Promise<UserResponseDto> {
    return this.authService.assignRole(username, dto, authHeader ?? "");
  }
}
