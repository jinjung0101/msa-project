import { Controller, Post, Body, Get, Query, Req } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Roles } from "@my-msa-project/share/security/roles.decorator";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { ZodValidationPipe } from "@my-msa-project/infrastructure/pipes/zod-validation.pipe";
import { RewardRequestService } from "../domain/services/reward-request.service";
import {
  RewardRequestZodSchema,
  RewardRequestZodModel,
} from "@my-msa-project/share/schemas/event/reward-request.schema";
import { RewardRequestRequestDto } from "./dtos/reward-request.request.dto";

@ApiTags("Reward Requests")
@Controller("reward-requests")
export class RewardRequestsController {
  constructor(private service: RewardRequestService) {}

  @Post()
  @Roles(UserRoleEnum.USER)
  @ApiBody({ type: RewardRequestRequestDto })
  @ApiResponse({ status: 201, type: String })
  async request(
    @Req() req: any,
    @Body(new ZodValidationPipe(RewardRequestZodSchema))
    dto: RewardRequestZodModel
  ) {
    return this.service.create({ ...dto, userId: req.user.id });
  }

  @Get("my")
  @Roles(UserRoleEnum.USER)
  @ApiResponse({ status: 200, type: [Object] })
  my(@Req() req: any) {
    return this.service.findByUser(req.user.id);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.AUDITOR)
  @ApiResponse({ status: 200, type: [Object] })
  all(@Query("eventId") eventId?: string, @Query("status") status?: string) {
    return this.service.findAll({ eventId, status });
  }
}
