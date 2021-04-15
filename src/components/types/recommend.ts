export interface Recommend {
  recommendId: number;
  userId: string;
  problemId: number;
  message: string;
  updateTime: string;
}

export interface RecommendForm {
  problemId?: number;
  recommendReason: string;
}
