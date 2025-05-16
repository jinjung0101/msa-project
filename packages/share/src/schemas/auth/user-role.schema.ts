import { z } from "zod";

export const UserRoleZodSchema = z.enum([
  "USER",
  "OPERATOR",
  "AUDITOR",
  "ADMIN",
] as const);

export type UserRole = z.infer<typeof UserRoleZodSchema>;

export enum UserRoleEnum {
  USER = "USER",
  OPERATOR = "OPERATOR",
  AUDITOR = "AUDITOR",
  ADMIN = "ADMIN",
}
