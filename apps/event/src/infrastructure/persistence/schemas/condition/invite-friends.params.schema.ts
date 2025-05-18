import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class InviteFriendsParamsEntity {
  @Prop({ required: true })
  count!: number;
}

export type InviteFriendsParamsDocument = InviteFriendsParamsEntity;
export const InviteFriendsParamsSchema = SchemaFactory.createForClass(InviteFriendsParamsEntity);