import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

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

  @Prop({ type: [Types.ObjectId], ref: "ConditionEntity", default: [] })
  conditions!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: "RewardDefinitionEntity", default: [] })
  rewardDefinitions!: Types.ObjectId[];
}

export type EventDocument = EventEntity & Document;
export const EventSchema = SchemaFactory.createForClass(EventEntity);
