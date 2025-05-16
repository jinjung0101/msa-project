import { Test, TestingModule } from "@nestjs/testing";
import { UserRepositoryAdapter } from "./user.repository";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { UserEntity, UserSchema, UserDocument } from "./schemas/user.entity";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Model } from "mongoose";
import { UserRoleEnum } from "@my-msa-project/share/schemas/auth/user-role.schema";

describe("UserRepositoryAdapter (통합)", () => {
  let mongod: MongoMemoryServer;
  let repo: UserRepositoryAdapter;
  let model: Model<UserDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: UserEntity.name, schema: UserSchema },
        ]),
      ],
      providers: [UserRepositoryAdapter],
    }).compile();

    repo = module.get<UserRepositoryAdapter>(UserRepositoryAdapter);
    model = module.get<Model<UserDocument>>(getModelToken(UserEntity.name));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it("create & findByUsername", async () => {
    await repo.create({
      username: "alice",
      passwordHash: "h",
      role: UserRoleEnum.USER,
    });
    const user = await repo.findByUsername("alice");
    expect(user).toMatchObject({ username: "alice", role: UserRoleEnum.USER });
  });

  it("findUserWithHash 반환", async () => {
    const credential = await repo.findUserWithHash("alice");
    expect(credential).toHaveProperty("passwordHash", "h");
  });

  it("updateRole 작동", async () => {
    const alice = await model.findOne({ username: "alice" });
    expect(alice).not.toBeNull();
    const updated = await repo.updateRole(alice!.id, UserRoleEnum.ADMIN);
    expect(updated.role).toBe(UserRoleEnum.ADMIN);
  });

  it("존재하지 않는 사용자 updateRole 에러", async () => {
    await expect(
      repo.updateRole("000000000000000000000000", UserRoleEnum.USER)
    ).rejects.toThrow();
  });
});
