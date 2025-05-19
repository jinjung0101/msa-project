import { SchemaOptions } from "mongoose";

export const BaseSchemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      // _id → id, __v 제거
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
};
