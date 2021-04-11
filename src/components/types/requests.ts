import { RecommendForm } from '.';

export interface GetProblemsReq {
  maxLength: number;
}

export interface GetProblemReq {
  id: number;
}

export type GetProblemRecommendsReq = GetProblemReq;

export type UploadRecommendReq = RecommendForm;

export interface UserLoginReq {
  username: string;
  password: string;
}

export interface UserRegisterReq extends UserLoginReq {
  email: string;
}
