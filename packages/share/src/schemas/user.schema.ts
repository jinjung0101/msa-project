import { z } from "zod";
import { UserRoleZodSchema } from "./user-role.schema";

export const UserZodSchema = z.object({
  username: z.string().min(3),
  passwordHash: z.string().min(60), // bcrypt 길이 가정
  roles: UserRoleZodSchema,
});

export type UserModel = z.infer<typeof UserZodSchema>;
