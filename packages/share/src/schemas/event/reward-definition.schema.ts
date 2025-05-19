import { z } from "zod";

export const PointsDetail = z.object({ amount: z.number().min(0) });
export const ItemDetail = z.object({
  itemId: z.string(),
  quantity: z.number().min(1),
});
export const CouponDetail = z.object({
  code: z.string(),
  expiresAt: z.preprocess((d) => new Date(d as string), z.date()),
});

export const RewardDefinitionZodSchema = z.discriminatedUnion("type", [
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("points"),
    detail: PointsDetail,
  }),
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("item"),
    detail: ItemDetail,
  }),
  z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    type: z.literal("coupon"),
    detail: CouponDetail,
  }),
]);

export type RewardDefinitionZodModel = z.infer<
  typeof RewardDefinitionZodSchema
>;
