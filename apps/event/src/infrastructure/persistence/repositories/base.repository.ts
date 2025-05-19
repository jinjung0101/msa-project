import { Types } from "mongoose";

export abstract class BaseRepository<T> {
  protected map(doc: any): T {
    // Mongoose Document이면 toJSON으로 _id -> id 변환, 아니면 plain object 복사
    const obj = typeof doc.toJSON === "function" ? doc.toJSON() : { ...doc };

    // 기본 _id 변환
    if (obj._id) {
      obj.id = (obj._id as Types.ObjectId).toString();
      delete obj._id;
    }

    // nested ObjectId도 문자열로 변환
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Types.ObjectId) {
        (obj as any)[key] = value.toString();
      }
    }
    return obj as T;
  }

  protected mapMany(docs: any[]): T[] {
    return docs.map((d) => this.map(d));
  }
}
