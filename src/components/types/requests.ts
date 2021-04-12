import { RecommendForm } from '.';

export interface GetProblemsReq {
  userId: string;
  maxLength: number;
}

export interface GetProblemReq {
  userId: string;
  id: number;
}

export interface GetRecommendsReq {
  userId: string;
  problemId: number;
}

export type UploadRecommendReq = RecommendForm;

export interface UserLoginReq {
  username: string;
  password: string;
}

export interface UserRegisterReq extends UserLoginReq {
  email: string;
}
