import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { GenericRepositoryAdapter } from "./generic.repository.adapter";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";

@Injectable()
export class ConditionRepositoryAdapter extends GenericRepositoryAdapter<ConditionDefinitionZodModel> {
  constructor(@InjectModel("Condition") model: Model<any>) {
    super(model, "eventId");
  }
}
