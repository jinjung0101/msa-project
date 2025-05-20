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

  async countConsecutiveDays(userId: string): Promise<number> {
    // 예시 구현: 오늘부터 거꾸로 연속 로그인 일수 계산
    const now = new Date();
    // 임의로 1년 전부터 조회 (데이터가 많지 않다면)
    const start = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    const dates = await this.findLoginDates(userId, start, now);
    const uniqueDays = Array.from(new Set(dates.map((d) => d.toDateString())))
      .map((s) => new Date(s))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let cursor = new Date(now.toDateString());
    for (const d of uniqueDays) {
      if (d.getTime() === cursor.getTime()) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }
}
