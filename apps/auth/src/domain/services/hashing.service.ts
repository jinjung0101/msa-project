export const HASHING_SERVICE = Symbol("HASHING_SERVICE");

export interface HashingService {
  hash(password: string, saltRounds?: number): Promise<string>;

  compare(password: string, hash: string): Promise<boolean>;
}
