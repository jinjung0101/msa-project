import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PointsDetailEntity {
  @Prop({ required: true })
  amount!: number;
}
export const PointsDetailSchema = SchemaFactory.createForClass(PointsDetailEntity);