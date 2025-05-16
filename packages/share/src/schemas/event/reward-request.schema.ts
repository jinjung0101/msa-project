import { z } from "zod";

export const RewardRequestZodSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  requestedAt: z.preprocess((d) => new Date(d as string), z.date()),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  processedAt: z.preprocess((d) => new Date(d as string), z.date()).optional(),
});

export type RewardRequestZodModel = z.infer<typeof RewardRequestZodSchema>;
