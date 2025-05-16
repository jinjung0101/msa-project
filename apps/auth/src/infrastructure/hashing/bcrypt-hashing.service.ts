import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { HashingService } from "../../domain/services/hashing.service";

@Injectable()
export class BcryptHashingService implements HashingService {
  async hash(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
