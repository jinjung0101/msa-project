import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class PointsDetailDto {
  @ApiProperty({ example: 100 })
  amount!: number;
}

export class ItemDetailDto {
  @ApiProperty({ example: "item123" })
  itemId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;
}

export class CouponDetailDto {
  @ApiProperty({ example: "SAVE20" })
  code!: string;

  @ApiProperty({ example: new Date().toISOString(), format: "date-time" })
  expiresAt!: Date;
}

export class RewardDefinitionRequestDto {
  @ApiProperty({ enum: ["points", "item", "coupon"] })
  type!: "points" | "item" | "coupon";

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(PointsDetailDto) },
      { $ref: getSchemaPath(ItemDetailDto) },
      { $ref: getSchemaPath(CouponDetailDto) },
    ],
  })
  detail!: PointsDetailDto | ItemDetailDto | CouponDetailDto;
}
