import { RecommendForm } from '.';

interface ReqHeader {
  userId: string;
}

export interface GetProblemsReq extends ReqHeader {
  maxLength: number;
}

export interface GetProblemReq extends ReqHeader {
  id: number;
}

export type GetProblemRecommendsReq = GetProblemReq;

export interface UploadRecommendReq
  extends ReqHeader,
    Required<RecommendForm> {}

export interface UserLoginReq {
  username: string;
  password: string;
}

export interface UserRegisterReq extends UserLoginReq {
  email: string;
}
