import { Injectable } from "@nestjs/common";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { TransactionManagerPort } from "../../domain/ports/transaction-manager.port";

@Injectable()
export class MongooseTransactionManager implements TransactionManagerPort {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    const session = await this.conn.startSession();
    try {
      return await session.withTransaction(fn);
    } finally {
      session.endSession();
    }
  }
}
