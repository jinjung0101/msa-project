import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SESSION_REPOSITORY,
  SessionRepositoryPort,
  SessionEntity,
} from "../../domain/ports/session.repository.port";
import { SessionDoc, SessionDocument } from "./schemas/session.entity";

@Injectable()
export class SessionRepositoryAdapter implements SessionRepositoryPort {
  constructor(
    @InjectModel(SessionDoc.name)
    private readonly model: Model<SessionDocument>
  ) {}

  async findByUserId(userId: string): Promise<SessionEntity | null> {
    const doc = await this.model.findOne({ userId }).exec();
    return doc
      ? { userId: doc.userId, jti: doc.jti, expiresAt: doc.expiresAt }
      : null;
  }

  async upsert(session: SessionEntity): Promise<void> {
    await this.model
      .findOneAndUpdate({ userId: session.userId }, session, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteOne({ userId }).exec();
  }
}
