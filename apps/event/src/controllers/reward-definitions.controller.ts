import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { Roles } from "@my-msa-project/share/security/roles.decorator";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { ZodValidationPipe } from "@my-msa-project/infrastructure/pipes/zod-validation.pipe";
import { RewardDefinitionService } from "../domain/services/reward-definition.service";
import {
  RewardDefinitionZodSchema,
  RewardDefinitionZodModel,
} from "@my-msa-project/share/schemas/event/reward-definition.schema";
import { RewardDefinitionRequestDto } from "./dtos/reward-definition.request.dto";

@ApiTags("Reward Definitions")
@Controller("events/:eventId/reward-definitions")
export class RewardDefinitionsController {
  constructor(private service: RewardDefinitionService) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR)
  @ApiBody({ type: [RewardDefinitionRequestDto] })
  @ApiResponse({ status: 201, type: [String] })
  create(
    @Param("eventId") eventId: string,
    @Body(new ZodValidationPipe(RewardDefinitionZodSchema))
    dto: RewardDefinitionZodModel
  ) {
    // eventId 덮어쓰기
    return this.service.bulkCreate([{ ...dto, eventId }]);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.AUDITOR)
  @ApiParam({ name: "eventId", type: String, description: "Event ID" })
  @ApiResponse({ status: 200, type: [RewardDefinitionRequestDto] })
  list(@Param("eventId") eventId: string) {
    return this.service.findByEvent(eventId);
  }
}
