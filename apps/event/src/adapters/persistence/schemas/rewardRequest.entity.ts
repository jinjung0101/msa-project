import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: { createdAt: "requestedAt", updatedAt: false } })
export class RewardRequestEntity {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({ enum: ["pending", "approved", "rejected"], default: "pending" })
  status!: string;

  @Prop()
  processedAt?: Date;
}

export type RewardRequestDocument = RewardRequestEntity & Document;
export const RewardRequestSchema =
  SchemaFactory.createForClass(RewardRequestEntity);
