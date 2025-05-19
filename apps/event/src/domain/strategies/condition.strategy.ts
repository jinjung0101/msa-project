export interface ConditionStrategy {
  supports(type: string): boolean;
  validate(userId: string, params: any): Promise<boolean>;
}
