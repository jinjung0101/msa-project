import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { GenericRepositoryAdapter } from "./generic.repository.adapter";
import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";
import {
  RewardDefinitionBaseDocument,
  RewardDefinitionBaseEntity,
} from "../schemas/reward-definition/reward-definition.base.entity";

@Injectable()
export class RewardDefinitionRepositoryAdapter extends GenericRepositoryAdapter<RewardDefinitionZodModel> {
  constructor(
    @InjectModel(RewardDefinitionBaseEntity.name)
    model: Model<RewardDefinitionBaseDocument>
  ) {
    super(model, "eventId");
  }
}
