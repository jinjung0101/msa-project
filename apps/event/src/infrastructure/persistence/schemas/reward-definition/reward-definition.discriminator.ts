import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema } from "mongoose";
import {
  RewardDefinitionBaseEntity,
  RewardDefinitionBaseDocument,
} from "./reward-definition.base.entity";
import { PointsDetailSchema } from "./points-detail.schema";
import { ItemDetailSchema } from "./item-detail.schema";
import { CouponDetailSchema } from "./coupon-detail.schema";

@Injectable()
export class RewardDefinitionDiscriminatorProvider implements OnModuleInit {
  constructor(
    @InjectModel(RewardDefinitionBaseEntity.name)
    private readonly baseModel: Model<RewardDefinitionBaseDocument>
  ) {}

  onModuleInit() {
    this.baseModel.discriminator(
      "points",
      new Schema({ detail: PointsDetailSchema.obj })
    );
    this.baseModel.discriminator(
      "item",
      new Schema({ detail: ItemDetailSchema.obj })
    );
    this.baseModel.discriminator(
      "coupon",
      new Schema({ detail: CouponDetailSchema.obj })
    );
  }
}
