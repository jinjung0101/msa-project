import { z } from "zod";

export const RewardSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  grantedAt: z.preprocess((v) => new Date(v as string), z.date()),
  amount: z.number().min(0),
});

export type RewardModel = z.infer<typeof RewardSchema>;
