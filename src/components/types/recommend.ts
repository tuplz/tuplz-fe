export interface Recommend {
  userId: number;
  problemId: number;
  recommendId: number;
  message: string;
  updateTime: string;
}

export interface RecommendFormState {
  recommendUrl: string;
  recommendReason: string;
}
