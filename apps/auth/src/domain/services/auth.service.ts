import {
  ConflictException,
  Inject,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(HASHING_SERVICE) private readonly hashingService: HashingService
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

  async login(dto: LoginUserDto): Promise<UserResponseDto> {
    const cred = await this.userRepo.findUserWithHash(dto.username);
    if (
      !cred ||
      !(await this.hashingService.compare(dto.password, cred.passwordHash))
    ) {
      throw new UnauthorizedException(
        "아이디 또는 비밀번호가 올바르지 않습니다"
      );
    }
    // JWT 발급 등…
    return { id: cred.id, username: cred.username, role: cred.role };
  }
}
