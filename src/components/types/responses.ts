import { Problem, Recommend } from '.';

export interface GetProblemsResp {
  prob: Problem[];
}

export interface GetProblemResp {
  prob: Problem;
}

export interface GetRecommendsResp {
  recommends: Recommend[];
}
