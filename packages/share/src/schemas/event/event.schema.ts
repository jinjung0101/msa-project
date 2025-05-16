import { z } from "zod";

export const EventZodSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.preprocess((val) => new Date(val as string), z.date()),
  endDate: z.preprocess((val) => new Date(val as string), z.date()),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type EventZodModel = z.infer<typeof EventZodSchema>;
