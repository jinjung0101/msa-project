import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity, UserDocument } from "./schemas/user.entity";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { toUserResponseDto } from "./user.mapper";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserEntity.name) private readonly model: Model<UserDocument>
  ) {}

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
    return toUserResponseDto(doc);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return (await this.model.exists({ username })) !== null;
  }

  async findByUsername(username: string): Promise<UserResponseDto | null> {
    const doc = await this.model.findOne({ username }).exec();
    if (!doc) return null;
    return toUserResponseDto(doc);
  }

  async findUserWithHash(
    username: string
  ): Promise<(UserResponseDto & { passwordHash: string }) | null> {
    const doc = await this.model.findOne({ username }).exec();
    if (!doc) return null;
    return {
      ...toUserResponseDto(doc),
      passwordHash: doc.passwordHash,
    };
  }

  async updateRole(
    userId: string,
    role: UserRoleEnum
  ): Promise<UserResponseDto> {
    const doc = await this.model
      .findByIdAndUpdate(userId, { role }, { new: true, runValidators: true })
      .exec();
    if (!doc) {
      throw new NotFoundException(`사용자(id=${userId})를 찾을 수 없습니다`);
    }
    return toUserResponseDto(doc);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc)
      throw new NotFoundException(`사용자(id=${id})를 찾을 수 없습니다`);
    return toUserResponseDto(doc);
  }

  async findAll(
    filter: Partial<Record<keyof UserResponseDto, unknown>>
  ): Promise<UserResponseDto[]> {
    const docs = await this.model.find(filter as any).exec();
    return docs.map(toUserResponseDto);
  }
}
