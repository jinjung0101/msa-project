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
  { userId: 1, eventId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "approved"] } },
  }
);

RewardRequestSchema.set("toJSON", BaseSchemaOptions.toJSON);
