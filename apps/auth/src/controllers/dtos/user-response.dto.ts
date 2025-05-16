import { ApiProperty } from "@nestjs/swagger";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ enum: UserRoleEnum })
  role!: UserRoleEnum;
}
