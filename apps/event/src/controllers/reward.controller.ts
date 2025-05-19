import { Controller, Post, Get, Query, Body } from "@nestjs/common";
import { Roles } from "@my-msa-project/share/security/roles.decorator";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { RewardService } from "../domain/services/reward.service";
import { RewardZodModel } from "@my-msa-project/share/schemas/event/reward.schema";

@Controller("rewards")
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @Roles(UserRoleEnum.OPERATOR, UserRoleEnum.ADMIN)
  issue(@Body() dto: RewardZodModel): Promise<string> {
    return this.rewardService.issueReward(dto);
  }

  @Get()
  @Roles(UserRoleEnum.AUDITOR, UserRoleEnum.ADMIN)
  list(
    @Query("userId") userId?: string,
    @Query("eventId") eventId?: string
  ): Promise<(RewardZodModel & { id: string })[]> {
    return this.rewardService.listRewards({ userId, eventId });
  }
}
