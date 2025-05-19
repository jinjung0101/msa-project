import { z } from "zod";

export const LoginStreakParams = z.object({ days: z.number().min(1) });
export const InviteFriendsParams = z.object({ count: z.number().min(1) });

export const ConditionZodSchema = z.discriminatedUnion("type", [
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("loginStreak"),
    parameters: LoginStreakParams,
  }),
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("inviteFriends"),
    parameters: InviteFriendsParams,
  }),
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("custom"),
    parameters: z.record(z.unknown()),
  }),
]);

export type ConditionDefinitionZodModel = z.infer<typeof ConditionZodSchema>;
