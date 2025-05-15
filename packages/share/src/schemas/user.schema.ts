import { z } from "zod";
import { UserRole } from "../models/user.model";

export const UserSchema = z.object({
  username: z.string().min(3),
  passwordHash: z.string().min(60), // bcrypt 길이 가정
  roles: z.array(z.nativeEnum(UserRole)).nonempty(),
});

export type UserModel = z.infer<typeof UserSchema>;
