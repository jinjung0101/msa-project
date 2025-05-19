import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseSchemaOptions } from "./base.schema";

@Schema({ timestamps: true })
export class EventEntity {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ default: "active", enum: ["active", "inactive"] })
  status!: "active" | "inactive";

  @Prop({ type: [Types.ObjectId], ref: "Condition", default: [] })
  conditions!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: "RewardDefinition", default: [] })
  rewardDefinitions!: Types.ObjectId[];
}

export type EventDocument = EventEntity & Document;
export const EventSchema = SchemaFactory.createForClass(EventEntity);

EventSchema.set("toJSON", BaseSchemaOptions.toJSON);
