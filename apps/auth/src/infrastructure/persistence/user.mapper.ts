import { UserDocument } from "./schemas/user.entity";
import { UserResponseDto } from "@my-msa-project/share/schemas/auth/user.schema";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

/** DB 엔티티 → API DTO 매핑 */
export function toUserResponseDto(doc: UserDocument): UserResponseDto {
  return {
    id: doc.id,
    username: doc.username,
    role: doc.role as UserRoleEnum,
  };
}
