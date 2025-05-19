import { ApiProperty } from "@nestjs/swagger";

export class EventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  status!: "active" | "inactive";

  @ApiProperty({ type: [String] })
  conditions!: string[];

  @ApiProperty({ type: [String] })
  rewardDefinitions!: string[];
}
