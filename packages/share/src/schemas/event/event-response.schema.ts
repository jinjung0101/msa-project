import { z } from "zod";
import { EventZodSchema } from "./event.schema";

export const EventResponseSchema = EventZodSchema.extend({
  id: z.string(),
  conditions: z.array(z.string()),
  rewardDefinitions: z.array(z.string()),
});
export type EventResponseDto = z.infer<typeof EventResponseSchema>;
