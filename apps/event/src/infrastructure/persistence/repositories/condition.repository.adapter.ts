import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { GenericRepositoryAdapter } from "./generic.repository.adapter";
import { ConditionDefinitionZodModel } from "@my-msa-project/share/schemas/event/condition.schema";
import {
  ConditionBaseDocument,
  ConditionBaseEntity,
} from "../schemas/condition/condition.base.entity";

@Injectable()
export class ConditionRepositoryAdapter extends GenericRepositoryAdapter<ConditionDefinitionZodModel> {
  constructor(
    @InjectModel(ConditionBaseEntity.name)
    model: Model<ConditionBaseDocument>
  ) {
    super(model, "eventId");
  }
}
