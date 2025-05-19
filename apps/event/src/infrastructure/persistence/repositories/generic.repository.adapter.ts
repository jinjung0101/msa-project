import { Model, Types } from "mongoose";
import { BaseRepository } from "./base.repository";

export abstract class GenericRepositoryAdapter<
  TModel,
> extends BaseRepository<TModel> {
  constructor(
    protected readonly model: Model<any>,
    private readonly refKey: string
  ) {
    super();
  }

  /**
   * items를 any[]가 아니라 TModel[]로 받아 타입 안정성 강화
   */
  async bulkCreate(items: (TModel & { eventId: string })[]): Promise<string[]> {
    // items 안에는 반드시 eventId:string 프로퍼티가 있다고 가정
    const docs = (items as any[]).map((item) => ({
      ...item,
      [this.refKey]: new Types.ObjectId(item.eventId),
    }));
    const res = await this.model.insertMany(docs);
    return res.map((d) => d._id.toString());
  }

  async findByEvent(eventId: string): Promise<TModel[]> {
    const docs = await this.model
      .find({ [this.refKey]: new Types.ObjectId(eventId) })
      .exec();
    return this.mapMany(docs);
  }
}
