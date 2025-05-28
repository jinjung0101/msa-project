import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema } from "mongoose";
import {
  ConditionBaseEntity,
  ConditionBaseDocument,
} from "./condition.base.entity";
import { LoginStreakParamsSchema } from "./login-streak.params.schema";
import { InviteFriendsParamsSchema } from "./invite-friends.params.schema";
import { CustomParamsSchema } from "./custom.params.schema";

@Injectable()
export class ConditionDiscriminatorProvider implements OnModuleInit {
  constructor(
    @InjectModel(ConditionBaseEntity.name)
    private readonly conditionModel: Model<ConditionBaseDocument>
  ) {}

  onModuleInit() {
    this.conditionModel.discriminator(
      "loginStreak",
      new Schema({ parameters: LoginStreakParamsSchema.obj })
    );
    this.conditionModel.discriminator(
      "inviteFriends",
      new Schema({ parameters: InviteFriendsParamsSchema.obj })
    );
    this.conditionModel.discriminator(
      "custom",
      new Schema({ parameters: CustomParamsSchema.obj })
    );
  }
}
