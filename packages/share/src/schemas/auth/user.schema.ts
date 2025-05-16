import { z } from "zod";
import { UserRoleZodSchema } from "./user-role.schema";

// 클라이언트가 ROLE을 직접 주입하지 않도록 제거
export const RegisterUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

// 관리자 생성/업데이트용 별도 스키마
export const AssignRoleSchema = z.object({
  role: UserRoleZodSchema,
});
export type AssignRoleDto = z.infer<typeof AssignRoleSchema>;

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
