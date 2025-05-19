import { ApiProperty } from "@nestjs/swagger";

export class RewardRequestRequestDto {
  @ApiProperty({ example: "60a7c..." })
  eventId!: string;
}
