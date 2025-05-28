import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ZodValidationPipe } from "@my-msa-project/infrastructure/pipes/zod-validation.pipe";
import { EventService } from "../domain/services/event.service";
import {
  CreateEventDto,
  CreateEventSchema,
} from "@my-msa-project/share/schemas/event/create-event.schema";
import { Roles } from "@my-msa-project/share/security/roles.decorator";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { EventResponseDto } from "./dtos/event-response.dto";
import { CreateEventRequestDto } from "./dtos/create-event.request.dto";

@ApiTags("Events")
@Controller("events")
@ApiBearerAuth("access-token")
export class EventsController {
  constructor(private service: EventService) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR)
  @ApiBody({ type: CreateEventRequestDto })
  @ApiResponse({ status: 201, type: EventResponseDto })
  create(
    @Body(new ZodValidationPipe(CreateEventSchema))
    dto: CreateEventDto
  ) {
    return this.service.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [EventResponseDto] })
  list() {
    return this.service.list();
  }

  @Get(":id")
  @ApiResponse({ status: 200, type: EventResponseDto })
  @ApiResponse({ status: 404, description: "이벤트를 찾을 수 없음" })
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Patch(":id/deactivate")
  @Roles(UserRoleEnum.ADMIN)
  deactivate(@Param("id") id: string) {
    return this.service.deactivate(id);
  }
}
