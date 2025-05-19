import { ApiProperty } from "@nestjs/swagger";

export class RewardDefinitionRequestDto {
  @ApiProperty({ enum: ["points", "item", "coupon"] })
  type!: "points" | "item" | "coupon";

  @ApiProperty({ type: "object", additionalProperties: true })
  detail!: Record<string, any>;
}
