import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class CustomParamsEntity {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  parameters!: Record<string, unknown>;
}

export type CustomParamsDocument = CustomParamsEntity;
export const CustomParamsSchema = SchemaFactory.createForClass(CustomParamsEntity);