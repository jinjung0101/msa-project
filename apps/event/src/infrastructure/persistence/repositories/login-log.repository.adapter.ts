import { Injectable, Inject } from "@nestjs/common";
import { Model, Types } from "mongoose";
import {
  LoginLogRepositoryPort,
  LOGIN_LOG_REPOSITORY,
} from "apps/event/src/domain/ports/login-log.repository.port";
import { LoginLogEntity, LoginLogDocument } from "../schemas/login-log.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class LoginLogRepositoryAdapter implements LoginLogRepositoryPort {
  constructor(
    @InjectModel(LoginLogEntity.name)
    private readonly model: Model<LoginLogDocument>
  ) {}

  async findLoginDates(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Date[]> {
    const docs = await this.model
      .find({
        userId: new Types.ObjectId(userId),
        loggedAt: { $gte: start, $lte: end },
      })
      .select("loggedAt -_id")
      .exec();
    return docs.map((d) => d.loggedAt);
  }
}
