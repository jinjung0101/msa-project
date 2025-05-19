import {
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

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(HASHING_SERVICE) private readonly hashingService: HashingService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    // 1) 중복 검사
    if (await this.userRepo.existsByUsername(dto.username)) {
      throw new ConflictException("이미 사용 중인 사용자 이름입니다");
    }

    // 2) 평문 비밀번호 해싱
    const passwordHash = await this.hashingService.hash(dto.password);

    // 3) 저장
    try {
      return await this.userRepo.create({
        ...dto,
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
    const cred = await this.userRepo.findUserWithHash(dto.username);
    if (
      !cred ||
      !(await this.hashingService.compare(dto.password, cred.passwordHash))
    ) {
      throw new UnauthorizedException(
        "아이디 또는 비밀번호가 올바르지 않습니다"
      );
    }
    // JWT 발급
    const payload = { sub: cred.id, username: cred.username, role: cred.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  /** 사용자 롤 변경(Assign Role) */
  async assignRole(
    username: string,
    role: UserRoleEnum
  ): Promise<UserResponseDto> {
    // 1) 존재 확인 (NotFoundException을 던지도록 레포가 처리해 주므로 생략 가능)
    const existing = await this.userRepo.findByUsername(username);
    if (!existing)
      throw new NotFoundException(`사용자(id=${username})를 찾을 수 없습니다`);

    // 2) 업데이트
    return this.userRepo.updateRole(existing.id, role);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    return this.userRepo.findById(id);
  }


  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userRepo.findAll({});
  }
}
