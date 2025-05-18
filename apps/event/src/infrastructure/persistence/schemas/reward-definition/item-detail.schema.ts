import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ItemDetailEntity {
  @Prop({ required: true })
  itemId!: string;

  @Prop({ required: true })
  quantity!: number;
}
export const ItemDetailSchema = SchemaFactory.createForClass(ItemDetailEntity);