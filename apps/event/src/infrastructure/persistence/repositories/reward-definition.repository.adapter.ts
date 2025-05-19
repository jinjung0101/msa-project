import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { GenericRepositoryAdapter } from "./generic.repository.adapter";
import { RewardDefinitionZodModel } from "@my-msa-project/share/schemas/event/reward-definition.schema";

@Injectable()
export class RewardDefinitionRepositoryAdapter extends GenericRepositoryAdapter<RewardDefinitionZodModel> {
  constructor(@InjectModel("RewardDefinition") model: Model<any>) {
    super(model, "eventId");
  }
}
