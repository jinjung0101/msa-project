import { z } from "zod";

export enum UserRoleEnum {
  USER = "USER",
  OPERATOR = "OPERATOR",
  AUDITOR = "AUDITOR",
  ADMIN = "ADMIN",
}

export const UserRoleZodSchema = z.nativeEnum(UserRoleEnum);

export type UserRole = z.infer<typeof UserRoleZodSchema>;
