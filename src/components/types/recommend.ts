export interface Recommend {
  userId: number;
  problemId: number;
  recommendId: number;
  message: string;
  updateTime: string;
}

export interface RecommendForm {
  userId: string;
  recommendUrl: string;
  recommendReason: string;
}
