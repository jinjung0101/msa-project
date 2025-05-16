import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from "../ports/user.repository.port";
import { HASHING_SERVICE, HashingService } from "./hashing.service";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import {
  RegisterUserDto,
  LoginUserDto,
} from "@my-msa-project/share/schemas/auth/user.schema";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

describe("AuthService", () => {
  let service: AuthService;
  let userRepo: jest.Mocked<UserRepositoryPort>;
  let hashing: jest.Mocked<HashingService>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    userRepo = {
      create: jest.fn(),
      existsByUsername: jest.fn(),
      findByUsername: jest.fn(),
      findUserWithHash: jest.fn(),
      updateRole: jest.fn(),
    };
    hashing = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    jwt = { sign: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: userRepo },
        { provide: HASHING_SERVICE, useValue: hashing },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    const dto: RegisterUserDto = { username: "bob", password: "secret" };

    it("성공: 중복 없고 create 호출", async () => {
      userRepo.existsByUsername.mockResolvedValue(false);
      hashing.hash.mockResolvedValue("hashed");
      userRepo.create.mockResolvedValue({
        id: "1",
        username: "bob",
        role: UserRoleEnum.USER,
      });

      const result = await service.register(dto);
      expect(hashing.hash).toHaveBeenCalledWith("secret");
      expect(userRepo.create).toHaveBeenCalledWith({
        ...dto,
        passwordHash: "hashed",
        role: UserRoleEnum.USER,
      });
      expect(result).toEqual({
        id: "1",
        username: "bob",
        role: UserRoleEnum.USER,
      });
    });

    it("실패: 중복 사용자 예외", async () => {
      userRepo.existsByUsername.mockResolvedValue(true);
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        ConflictException
      );
    });

    it("실패: mongo duplicate key 예외 전환", async () => {
      userRepo.existsByUsername.mockResolvedValue(false);
      hashing.hash.mockResolvedValue("h");
      const err = { code: 11000 };
      userRepo.create.mockRejectedValue(err);
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        ConflictException
      );
    });
  });

  describe("login", () => {
    const dto: LoginUserDto = { username: "bob", password: "secret" };

    it("성공: 토큰 반환", async () => {
      userRepo.findUserWithHash.mockResolvedValue({
        id: "1",
        username: "bob",
        role: UserRoleEnum.ADMIN,
        passwordHash: "h",
      });
      hashing.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      const result = await service.login(dto);
      expect(hashing.compare).toHaveBeenCalledWith("secret", "h");
      expect(jwt.sign).toHaveBeenCalledWith({
        sub: "1",
        username: "bob",
        role: UserRoleEnum.ADMIN,
      });
      expect(result).toEqual({ accessToken: "token" });
    });

    it("실패: 사용자 없거나 비밀번호 불일치", async () => {
      userRepo.findUserWithHash.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException
      );

      userRepo.findUserWithHash.mockResolvedValue({
        id: "1",
        username: "bob",
        role: UserRoleEnum.USER,
        passwordHash: "h",
      });
      hashing.compare.mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException
      );
    });
  });

  describe("assignRole", () => {
    it("성공: updateRole 호출", async () => {
      userRepo.findByUsername.mockResolvedValue({
        id: "1",
        username: "bob",
        role: UserRoleEnum.USER,
      });
      userRepo.updateRole.mockResolvedValue({
        id: "1",
        username: "bob",
        role: UserRoleEnum.AUDITOR,
      });
      const res = await service.assignRole("1", UserRoleEnum.AUDITOR);
      expect(userRepo.updateRole).toHaveBeenCalledWith(
        "1",
        UserRoleEnum.AUDITOR
      );
      expect(res.role).toEqual(UserRoleEnum.AUDITOR);
    });
  });
});
