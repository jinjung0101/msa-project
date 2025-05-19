import { ApiProperty } from "@nestjs/swagger";
import { ConditionDefinitionRequestDto } from "./condition-definition.request.dto";
import { RewardDefinitionRequestDto } from "./reward-definition.request.dto";

export class CreateEventRequestDto {
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

  @ApiProperty({ type: [ConditionDefinitionRequestDto] })
  conditions!: ConditionDefinitionRequestDto[];

  @ApiProperty({ type: [RewardDefinitionRequestDto] })
  rewardDefinitions!: RewardDefinitionRequestDto[];
}
