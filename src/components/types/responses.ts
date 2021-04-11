import { Problem, Recommend } from '.';

interface Status {
  status: string;
}

export interface GetProblemsResp extends Status {
  prob: Problem[];
}

export interface GetProblemResp extends Status {
  prob: Problem;
}

export interface GetRecommendsResp extends Status {
  recommends: Recommend[];
}

export interface GetRecommendResp extends Status {
  recommend: Recommend;
}

export type UploadRecommendResp = GetRecommendResp;

export interface UserLoginResp extends Status {
  id: number;
}

export type UserRegisterResp = UserLoginResp;
