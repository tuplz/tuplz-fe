export interface Recommend {
  userId: string;
  problemId: number;
  recommendId: number;
  message: string;
  updateTime: string;
}

export interface RecommendForm {
  problemId?: number;
  recommendReason: string;
}
