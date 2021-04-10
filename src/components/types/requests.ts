import { RecommendForm, UserToken } from '.';

export interface GetProblemsReq {
  maxLength: number;
}

export interface GetProblemReq {
  id: number;
}

export interface UploadRecommendReq extends RecommendForm, UserToken {}

export interface UserLoginReq {
  username: string;
  password: string;
}
