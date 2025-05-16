import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
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
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.USER,
  })
  role!: UserRoleEnum;
}

export type UserDocument = UserEntity & Document;
export const UserSchema = SchemaFactory.createForClass(UserEntity);

// 응답 직전에 민감 데이터 제거 및 id 변환
UserSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.passwordHash;
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
