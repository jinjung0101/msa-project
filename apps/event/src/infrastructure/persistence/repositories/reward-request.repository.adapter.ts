import { Model, mongo, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { RewardRequestDocument } from "../schemas/rewardRequest.entity";
import { RewardRequestZodModel } from "@my-msa-project/share/schemas/event/reward-request.schema";
import { RewardRequestRepositoryPort } from "apps/event/src/domain/ports/reward-request.repository.port";

@Injectable()
export class RewardRequestRepositoryAdapter
  extends BaseRepository<RewardRequestZodModel & { id: string }>
  implements RewardRequestRepositoryPort
{
  constructor(
    @InjectModel("RewardRequestEntity")
    private readonly model: Model<RewardRequestDocument>
  ) {
    super();
  }

  async existsPendingOrApproved(
    userId: string,
    eventId: string
  ): Promise<boolean> {
    return (
      (await this.model.exists({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
        status: { $in: ["pending", "approved"] },
      })) !== null
    );
  }

  async create(req: RewardRequestZodModel): Promise<string> {
    const filter = {
      userId: new Types.ObjectId(req.userId),
      eventId: new Types.ObjectId(req.eventId),
    };

    try {
      const existing = await this.model
        .findOneAndUpdate(
          filter,
          {
            $setOnInsert: {
              status: req.status,
              requestedAt: req.requestedAt,
            },
          },
          { upsert: true, new: false }
        )
        .exec();

      // upsert된 문서가 이미 있었다면, existing !== null
      if (existing) {
        return existing.id;
      }
      const inserted = await this.model.findOne(filter).exec();
      return inserted!.id;
    } catch (err) {
      // MongoDB 중복 키 에러만 잡아서 ConflictException으로 변환
      if (err instanceof mongo.MongoServerError && err.code === 11000) {
        throw new ConflictException("이미 요청된 이벤트입니다");
      }
      throw err;
    }
  }

  async findByUser(
    userId: string
  ): Promise<(RewardRequestZodModel & { id: string })[]> {
    const docs = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
    return this.mapMany(docs) as (RewardRequestZodModel & { id: string })[];
  }

  async findAll(filter?: {
    eventId?: string;
    status?: string;
  }): Promise<(RewardRequestZodModel & { id: string })[]> {
    const query: any = {};
    if (filter?.eventId) query.eventId = new Types.ObjectId(filter.eventId);
    if (filter?.status) query.status = filter.status;

    const docs = await this.model.find(query).exec();
    return this.mapMany(docs) as (RewardRequestZodModel & { id: string })[];
  }
}
