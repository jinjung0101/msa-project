import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseSchemaOptions } from "./base.schema";

@Schema({ timestamps: { createdAt: "requestedAt", updatedAt: false } })
export class RewardRequestEntity {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true,
  })
  status!: string;

  @Prop({})
  processedAt?: Date;
}

export type RewardRequestDocument = RewardRequestEntity & Document;
export const RewardRequestSchema =
  SchemaFactory.createForClass(RewardRequestEntity);

RewardRequestSchema.index(
  { userId: 1, eventId: 1, status: 1 },
  { unique: false } // 중복 허용은 안 되지만, unique: true로 하면 한 번도 요청 못 하므로 false
);

RewardRequestSchema.set("toJSON", BaseSchemaOptions.toJSON);
