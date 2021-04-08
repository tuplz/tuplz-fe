import { GetRecommendsResp, GetRecommendResp } from '@/components/types';
import { mock } from 'mockjs';

const mockRecommendTemplate = {
  'userId|1-10000': 1,
  'problemId|1-10000': 1,
  'recommendId|1-10000': 1,
  message: '@paragraph',
  updateTime: '@dateTime',
};

export const mockGetRecommendsResp: GetRecommendsResp = mock({
  'recommends|1-10': [mockRecommendTemplate],
});

export const mockGetRecommendResp: GetRecommendResp = mock({
  recommend: mockRecommendTemplate,
});
