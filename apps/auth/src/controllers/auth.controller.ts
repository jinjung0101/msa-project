import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../domain/services/auth.service";
import { ZodValidationPipe } from "infrastructure/pipes/zod-validation.pipe";
import {
  RegisterUserDto,
  RegisterUserSchema,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body(new ZodValidationPipe(RegisterUserSchema)) dto: RegisterUserDto
  ): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }
}
