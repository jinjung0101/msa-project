import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CouponDetailEntity {
  @Prop({ required: true })
  code!: string;

  @Prop({ required: true })
  expiresAt!: Date;
}
export const CouponDetailSchema = SchemaFactory.createForClass(CouponDetailEntity);