// 조건별 파라미터 모양을 먼저 정의
export interface LoginStreakParams {
  days: number;
}
export interface InviteFriendsParams {
  count: number;
}

// 파라미터 맵
export interface ConditionParamsMap {
  loginStreak: LoginStreakParams;
  inviteFriends: InviteFriendsParams;
  // custom은 key/value 구조를 허용하되, 가능한 최소 필드 정의
  custom: Record<string, unknown>;
}

// 유니온 타입으로 조건 정의
export type ConditionDefinitionModel =
  | {
      eventId: string;
      type: "loginStreak";
      parameters: LoginStreakParams;
    }
  | {
      eventId: string;
      type: "inviteFriends";
      parameters: InviteFriendsParams;
    }
  | {
      eventId: string;
      type: "custom";
      parameters: Record<string, unknown>;
    };
