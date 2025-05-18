import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LoginStreakParamsEntity {
  @Prop({ required: true })
  days!: number;
}

export type LoginStreakParamsDocument = LoginStreakParamsEntity;
export const LoginStreakParamsSchema = SchemaFactory.createForClass(LoginStreakParamsEntity);