import { z } from "zod";
import { EventZodSchema } from "./event.schema";
import { LoginStreakParams, InviteFriendsParams } from "./condition.schema";
import {
  PointsDetail,
  ItemDetail,
  CouponDetail,
} from "./reward-definition.schema";

const CreateConditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("loginStreak"), parameters: LoginStreakParams }),
  z.object({
    type: z.literal("inviteFriends"),
    parameters: InviteFriendsParams,
  }),
  z.object({ type: z.literal("custom"), parameters: z.record(z.unknown()) }),
]);

const CreateRewardDefinitionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("points"), detail: PointsDetail }),
  z.object({ type: z.literal("item"), detail: ItemDetail }),
  z.object({ type: z.literal("coupon"), detail: CouponDetail }),
]);

export const CreateEventSchema = EventZodSchema.extend({
  conditions: z.array(CreateConditionSchema).min(1),
  rewardDefinitions: z.array(CreateRewardDefinitionSchema).min(1),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;
