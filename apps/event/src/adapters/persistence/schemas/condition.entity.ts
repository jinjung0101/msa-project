import {
  ConditionDefinitionModel,
  InviteFriendsParams,
  LoginStreakParams,
} from "@my-msa-project/share/models/condition.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class ConditionEntity {
  @Prop({ type: Types.ObjectId, required: true })
  eventId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: ["loginStreak", "inviteFriends", "custom"],
    required: true,
  })
  type!: ConditionDefinitionModel["type"];

  @Prop({ type: Object, required: true })
  parameters!:
    | LoginStreakParams
    | InviteFriendsParams
    | Record<string, unknown>;
}

export type ConditionDocument = ConditionEntity & Document;
export const ConditionSchema = SchemaFactory.createForClass(ConditionEntity);
