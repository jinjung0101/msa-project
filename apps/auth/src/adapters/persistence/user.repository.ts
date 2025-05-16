import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity, UserDocument } from "./schemas/user.entity";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserEntity.name) private readonly model: Model<UserDocument>
  ) {}

  async create(
    input: Omit<RegisterUserDto, "password"> & { passwordHash: string }
  ): Promise<UserResponseDto> {
    const doc = await this.model.create(input);
    return doc.toJSON() as UserResponseDto;
  }

  async existsByUsername(username: string): Promise<boolean> {
    return (await this.model.exists({ username })) !== null;
  }

  async findByUsername(
    username: string
  ): Promise<(UserResponseDto & { passwordHash: string }) | null> {
    const doc = await this.model.findOne({ username }).lean().exec();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      role: doc.role,
      passwordHash: doc.passwordHash,
    };
  }
}
