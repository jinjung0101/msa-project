import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class LoginStreakParamsDto {
  @ApiProperty({ example: 3 })
  days!: number;
}
export class InviteFriendsParamsDto {
  @ApiProperty({ example: 5 })
  count!: number;
}
export class CustomParamsDto {
  @ApiProperty({ type: "object", additionalProperties: true })
  parameters!: Record<string, unknown>;
}

export class ConditionDefinitionRequestDto {
  @ApiProperty({ enum: ["loginStreak", "inviteFriends", "custom"] })
  type!: "loginStreak" | "inviteFriends" | "custom";

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(LoginStreakParamsDto) },
      { $ref: getSchemaPath(InviteFriendsParamsDto) },
      { $ref: getSchemaPath(CustomParamsDto) },
    ],
  })
  parameters!: LoginStreakParamsDto | InviteFriendsParamsDto | CustomParamsDto;
}
