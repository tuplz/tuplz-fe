import { RecommendFormState, GetRecommendsResp, GetRecommendResp } from '@/components/types';
import { mockGetRecommendsResp } from '@/api/mock/recommends';

// FIXME: remove mock data
const getRecommendations = (): Promise<GetRecommendsResp> =>
  new Promise((resolve, _reject) => {
    resolve(mockGetRecommendsResp);
  });

const uploadRecommendation = (
  data: RecommendFormState
): Promise<void> =>
  new Promise((_resolve, _reject) => {
    console.log(data);
  });

const recommendClient = {
  getRecommendations,
  uploadRecommendation,
};

export default recommendClient;
