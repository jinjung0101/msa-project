import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { EventEntity, EventDocument } from "../schemas/event.entity";
import { CreateEventDto } from "@my-msa-project/share/schemas/event/create-event.schema";
import { EventResponseDto } from "@my-msa-project/share/schemas/event/event-response.schema";
import { EventRepositoryPort } from "apps/event/src/domain/ports/event.repository.port";
import { toObjectIds } from "../../utils/object-id.util";

@Injectable()
export class EventRepositoryAdapter
  extends BaseRepository<EventResponseDto>
  implements EventRepositoryPort
{
  constructor(
    @InjectModel(EventEntity.name) private model: Model<EventDocument>
  ) {
    super();
  }

  async create(
    input: Omit<CreateEventDto, "conditions" | "rewardDefinitions"> & {
      conditions: string[];
      rewardDefinitions: string[];
    }
  ): Promise<EventResponseDto> {
    const doc = await this.model.create({
      ...input,
      conditions: toObjectIds(input.conditions),
      rewardDefinitions: toObjectIds(input.rewardDefinitions),
    });
    return this.map(doc);
  }

  async findAll(): Promise<EventResponseDto[]> {
    const docs = await this.model.find().exec();
    return this.mapMany(docs);
  }

  async findById(id: string): Promise<EventResponseDto | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.map(doc) : null;
  }

  async update(
    id: string,
    data: Partial<EventResponseDto>
  ): Promise<EventResponseDto> {
    const doc = await this.model
      .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`EVENT_ID=${id}를 찾을 수 없습니다.`);
    return this.map(doc);
  }

  async deactivate(id: string): Promise<void> {
    const res = await this.model.updateOne({ _id: id }, { status: "inactive" });
    if (res.matchedCount === 0)
      throw new NotFoundException(`EVENT_ID=${id}를 찾을 수 없습니다.`);
  }
}
