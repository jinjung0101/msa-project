import { z } from "zod";
import { UserRoleZodSchema } from "./user-role.schema";

export const RegisterUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: UserRoleZodSchema,
});
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

// 로그인용
export const LoginUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export type LoginUserDto = z.infer<typeof LoginUserSchema>;

// 응답 DTO
export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: UserRoleZodSchema,
});
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
