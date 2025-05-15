import {
  CouponDetail,
  ItemDetail,
  PointsDetail,
} from "@my-msa-project/share/models/rewardDefinition.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class RewardDefinitionEntity {
  @Prop({ type: Types.ObjectId, required: true })
  eventId!: Types.ObjectId;

  @Prop({ enum: ["points", "item", "coupon"] })
  type!: string;

  @Prop({ type: Object, required: true })
  detail!: PointsDetail | ItemDetail | CouponDetail;
}

export type RewardDefinitionDocument = RewardDefinitionEntity & Document;
export const RewardDefinitionSchema = SchemaFactory.createForClass(
  RewardDefinitionEntity
);
