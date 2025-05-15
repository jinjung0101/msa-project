export type RequestStatus = "pending" | "approved" | "rejected";

export interface RewardRequestModel {
  userId: string;
  eventId: string;
  requestedAt: Date;
  status: RequestStatus;
  processedAt?: Date;
}
