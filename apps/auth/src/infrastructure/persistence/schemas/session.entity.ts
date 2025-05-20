import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class SessionDoc {
  @Prop({ required: true, unique: true })
  userId!: string;

  @Prop({ required: true })
  jti!: string;

  @Prop({ required: true })
  expiresAt!: Date;
}
export type SessionDocument = SessionDoc & Document;
export const SessionSchema = SchemaFactory.createForClass(SessionDoc);

SessionSchema.index({ userId: 1 }, { unique: true });
// expiresAt TTL 인덱스: expiresAt 이후 0초 뒤 자동 삭제
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
