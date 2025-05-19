import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseSchemaOptions } from "./base.schema";

@Schema({ timestamps: { createdAt: "grantedAt", updatedAt: false } })
export class RewardEntity {
  @Prop({ type: Types.ObjectId, required: true })
  eventId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop()
  grantedAt!: Date;
}

export type RewardDocument = RewardEntity & Document;
export const RewardSchema = SchemaFactory.createForClass(RewardEntity);

RewardSchema.set("toJSON", BaseSchemaOptions.toJSON);
