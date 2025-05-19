import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: { createdAt: "loggedAt", updatedAt: false } })
export class LoginLogEntity {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId!: Types.ObjectId;

  /** 로그인 시각 (컬렉션의 createdAt) */
  loggedAt!: Date;
}

export type LoginLogDocument = LoginLogEntity & Document;
export const LoginLogSchema = SchemaFactory.createForClass(LoginLogEntity);
