import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventEntity, EventDocument } from "../schemas/event.entity";
import { EventModel } from "@my-msa-project/share/models/event.model";

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventEntity.name) private readonly model: Model<EventDocument>
  ) {}

  async create(data: Omit<EventModel, "status">): Promise<EventModel> {
    const doc = await this.model.create({
      ...data,
      status: "active",
    });
    return doc.toObject();
  }

  async findAll(): Promise<EventModel[]> {
    return this.model.find().lean().exec();
  }

  // 필요에 따라 findOne, update, delete 등 추가
}
