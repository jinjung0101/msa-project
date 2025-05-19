import { Types } from "mongoose";

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export function toObjectIds(ids: string[]): Types.ObjectId[] {
  return ids.map((id) => new Types.ObjectId(id));
}
