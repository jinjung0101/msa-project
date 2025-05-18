import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  discriminatorKey: 'type',
  _id: false,
})
export class ConditionBaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({ required: true, enum: ['loginStreak','inviteFriends','custom'], index: true })
  type!: string;
}

export type ConditionBaseDocument = ConditionBaseEntity & Document;
export const ConditionBaseSchema = SchemaFactory.createForClass(ConditionBaseEntity);