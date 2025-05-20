import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RewardEntity, RewardDocument } from "../schemas/reward.entity";
import { RewardZodModel } from "@my-msa-project/share/schemas/event/reward.schema";
import { BaseRepository } from "./base.repository";
import { RewardRepositoryPort } from "apps/event/src/domain/ports/reward.repository.port";

@Injectable()
export class RewardRepositoryAdapter
  extends BaseRepository<RewardZodModel & { id: string }>
  implements RewardRepositoryPort
{
  constructor(
    @InjectModel(RewardEntity.name)
    private readonly model: Model<RewardDocument>
  ) {
    super();
  }

  async create(dto: RewardZodModel): Promise<string> {
    const doc = await this.model.create({
      eventId: new Types.ObjectId(dto.eventId),
      userId: new Types.ObjectId(dto.userId),
      grantedAt: dto.grantedAt,
      amount: dto.amount,
    });
    return this.map(doc).id;
  }

  async findAll(filter?: {
    userId?: string;
    eventId?: string;
  }): Promise<(RewardZodModel & { id: string })[]> {
    const query: any = {};
    if (filter?.userId) query.userId = new Types.ObjectId(filter.userId);
    if (filter?.eventId) query.eventId = new Types.ObjectId(filter.eventId);
    const docs = await this.model.find(query).exec();
    return this.mapMany(docs);
  }
}
