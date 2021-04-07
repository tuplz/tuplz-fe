import { Problem } from '.';
import Recommend from './recommend';

export interface GetProblemsResp {
  prob: Problem[];
}

export interface GetProblemContentResp {
  prob: Problem;
}

export interface GetRecommendResp {
  recommends: Recommend[];
}