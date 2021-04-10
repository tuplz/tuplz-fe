import { RecommendForm, UserToken } from '.';

export interface GetProblemsReq extends UserToken {
  maxLength: number;
}

export interface GetProblemReq extends UserToken {
  id: number;
}

export interface UploadRecommendReq extends RecommendForm, UserToken {}

export interface UserLoginReq {
  username: string;
  password: string;
}
