export interface EventModel {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "inactive";
}
