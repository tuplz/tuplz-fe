export interface Recommend {
  userId: string;
  problemId: number;
  recommendId: number;
  message: string;
  updateTime: string;
}

export interface RecommendForm {
  userId: string;
  problemId: string;
  recommendUrl: string;
  recommendReason: string;
}
