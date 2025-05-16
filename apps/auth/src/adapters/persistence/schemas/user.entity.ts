import { UserRole } from "@my-msa-project/share/models/user.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role!: UserRole;
}

export type UserDocument = UserEntity & Document;
export const UserSchema = SchemaFactory.createForClass(UserEntity);
