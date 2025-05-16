import * as bcrypt from "bcrypt";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from "../ports/user.repository.port";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    // 1) 중복 검사
    if (await this.userRepo.existsByUsername(dto.username)) {
      throw new ConflictException("이미 사용 중인 사용자 이름입니다");
    }

    // 2) 평문 비밀번호 해싱
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3) 저장
    try {
      return await this.userRepo.create({ ...dto, passwordHash });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException("이미 사용 중인 사용자 이름입니다");
      }
      throw err;
    }
  }
}
