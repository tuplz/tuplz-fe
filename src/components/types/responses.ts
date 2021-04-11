import { Problem, Recommend } from '.';

interface Status {
  status: string;
}

export interface GetProblemsResp extends Status {
  problems: Problem[];
}

export interface GetProblemResp extends Status {
  problem: Problem;
}

export interface GetRecommendsResp extends Status {
  recommends: Recommend[];
}

export interface GetRecommendResp extends Status {
  recommend: Recommend;
}

export type GetProblemRecommendsResp = GetRecommendsResp;

export type UploadRecommendResp = GetRecommendResp;

export interface UserLoginResp extends Status {
  id: number;
}

export type UserRegisterResp = UserLoginResp;
