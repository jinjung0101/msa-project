import { CreateEventDto } from "@my-msa-project/share/schemas/event/create-event.schema";
import { EventResponseDto } from "@my-msa-project/share/schemas/event/event-response.schema";
import { EventZodModel } from "@my-msa-project/share/schemas/event/event.schema";

export const EVENT_REPOSITORY = Symbol("EVENT_REPOSITORY");

export interface EventRepositoryPort {
  create(
    input: Omit<CreateEventDto, "conditions" | "rewardDefinitions"> & {
      conditions: string[];
      rewardDefinitions: string[];
    }
  ): Promise<EventResponseDto>;

  findAll(): Promise<EventResponseDto[]>;

  findById(id: string): Promise<EventResponseDto | null>;

  update(
    id: string,
    data: Partial<EventResponseDto>
  ): Promise<EventResponseDto>;

  deactivate(id: string): Promise<void>;
}
