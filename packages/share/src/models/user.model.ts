export enum UserRole {
  USER = "USER",
  OPERATOR = "OPERATOR",
  AUDITOR = "AUDITOR",
  ADMIN = "ADMIN",
}

export interface UserModel {
  username: string;
  passwordHash: string;
  role: UserRole; // 단일 역할
}
