export interface UserModel {
  username: string;
  passwordHash: string;
  roles: string[]; // ex: ['USER','OPERATOR']
}

export enum UserRole {
  USER = "USER",
  OPERATOR = "OPERATOR",
  AUDITOR = "AUDITOR",
  ADMIN = "ADMIN",
}
