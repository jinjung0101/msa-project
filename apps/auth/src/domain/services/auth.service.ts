import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from "../ports/user.repository.port";
import {
  LoginUserDto,
  RegisterUserDto,
  UserResponseDto,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { HASHING_SERVICE, HashingService } from "./hashing.service";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";
import { JwtService } from "@nestjs/jwt";
import {
  SESSION_REPOSITORY,
  SessionRepositoryPort,
} from "../ports/session.repository.port";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,

    @Inject(HASHING_SERVICE)
    private readonly hashingService: HashingService,

    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepositoryPort,

    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    const { username, password } = dto;
    // 1) 중복 검사
    if (await this.userRepo.existsByUsername(username!)) {
      throw new ConflictException("이미 사용 중인 사용자 이름입니다");
    }

    // 2) 평문 비밀번호 해싱
    const passwordHash = await this.hashingService.hash(password!);

    // 3) 저장
    try {
      return await this.userRepo.create({
        username,
        passwordHash,
        role: UserRoleEnum.USER,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException("이미 사용 중인 사용자 이름입니다");
      }
      throw err;
    }
  }

  async login(dto: LoginUserDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;
    // 1) 사용자 존재 여부 및 비밀번호 확인
    const cred = await this.userRepo.findUserWithHash(username!);
    if (!cred) {
      throw new UnauthorizedException("사용자 없음");
    }
    if (!(await this.hashingService.compare(password!, cred.passwordHash))) {
      throw new UnauthorizedException("비밀번호 불일치");
    }
    // 2) 토큰 생성
    const jti = uuidv4();
    const expiresInSec = 60 * 60; // 1시간
    const payload = {
      sub: cred.id,
      username: cred.username,
      role: cred.role,
      jti,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: expiresInSec,
    });

    // 3) 세션 upsert → 중복 로그인 시 기존 토큰 즉시 만료 처리
    const expiresAt = new Date(Date.now() + expiresInSec * 1000);

    await this.sessionRepo.upsert({
      userId: cred.id!,
      jti,
      expiresAt,
    });
    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await this.sessionRepo.deleteByUserId(userId);
  }

  /** 사용자 롤 변경(Assign Role) */
  async assignRole(
    username: string,
    role: UserRoleEnum
  ): Promise<UserResponseDto> {
    if (!role) {
      throw new BadRequestException("role은 필수입니다");
    }
    // 1) 존재 확인 (NotFoundException을 던지도록 레포가 처리해 주므로 생략 가능)
    const existing = await this.userRepo.findByUsername(username);
    if (!existing)
      throw new NotFoundException(`사용자(id=${username})를 찾을 수 없습니다`);

    // 2) 업데이트
    return this.userRepo.updateRole(existing.id!, role);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    return this.userRepo.findById(id);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userRepo.findAll({});
  }
}
