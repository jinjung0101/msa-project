export const TRANSACTION_MANAGER = Symbol("TRANSACTION_MANAGER");

export interface TransactionManagerPort {
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
