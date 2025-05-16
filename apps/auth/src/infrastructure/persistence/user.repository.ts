import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity, UserDocument } from "./schemas/user.entity";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserEntity.name) private readonly model: Model<UserDocument>
  ) {}

  private mapToDto(doc: UserDocument): UserResponseDto {
    return {
      id: doc.id,
      username: doc.username,
      role: doc.role as UserRoleEnum,
    };
  }

  async create(
    input: Omit<RegisterUserDto, "password"> & {
      passwordHash: string;
      role?: UserRoleEnum;
    }
  ): Promise<UserResponseDto> {
    // 서비스에서 role(USER) 설정
    const doc = await this.model.create({
      ...input,
      role: input.role ?? UserRoleEnum.USER,
    });
    return this.mapToDto(doc);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return (await this.model.exists({ username })) !== null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const doc = await this.model.findOne({ username }).exec();
    if (!doc) return null;
    return await this.mapToDto(doc);
  }

  async findUserWithHash(
    username: string
  ): Promise<(UserResponseDto & { passwordHash: string }) | null> {
    const doc = await this.model.findOne({ username }).exec();
    if (!doc) return null;
    return {
      ...this.mapToDto(doc),
      passwordHash: doc.passwordHash,
    };
  }
}
