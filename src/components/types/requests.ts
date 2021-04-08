import { RecommendFormState, UserLoginToken } from '.';

export interface GetProblemsReq extends UserLoginToken {
  maxLength: number;
}

export interface GetProblemReq extends UserLoginToken {
  id: number;
}

export interface UploadRecommendReq
  extends RecommendFormState,
    UserLoginToken {}
