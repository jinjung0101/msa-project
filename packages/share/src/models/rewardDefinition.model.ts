export interface PointsDetail {
  amount: number;
}
export interface ItemDetail {
  itemId: string;
  quantity: number;
}
export interface CouponDetail {
  code: string;
  expiresAt: Date;
}

export interface RewardDetailMap {
  points: PointsDetail;
  item: ItemDetail;
  coupon: CouponDetail;
}

export type RewardDefinitionModel =
  | { eventId: string; type: "points"; detail: PointsDetail }
  | { eventId: string; type: "item"; detail: ItemDetail }
  | { eventId: string; type: "coupon"; detail: CouponDetail };
