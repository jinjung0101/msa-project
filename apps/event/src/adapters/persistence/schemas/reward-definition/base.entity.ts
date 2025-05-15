import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ discriminatorKey: 'type' })
export class RewardDefinitionBaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({ required: true, enum: ['points','item','coupon'] })
  type!: string;
}

export type RewardDefinitionBaseDocument = RewardDefinitionBaseEntity & Document;
export const RewardDefinitionBaseSchema = SchemaFactory.createForClass(RewardDefinitionBaseEntity);
