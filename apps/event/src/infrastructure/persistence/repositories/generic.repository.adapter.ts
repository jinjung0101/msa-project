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

  async bulkCreate(items: any[]): Promise<string[]> {
    const docs = items.map((item) => ({
      ...item,
      [this.refKey]: new Types.ObjectId((item as any).eventId),
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
