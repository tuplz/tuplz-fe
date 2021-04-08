import { Problem, Recommend } from '.';

export interface GetProblemsResp {
  problems: Problem[];
}

export interface GetProblemResp {
  problem: Problem;
}

export interface GetRecommendsResp {
  recommends: Recommend[];
}

export interface GetRecommendResp {
  recommend: Recommend;
}
