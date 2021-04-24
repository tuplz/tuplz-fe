import {
  GetRecommendsResp,
  GetRecommendResp,
  UploadRecommendResp,
} from '@/components/types';
import { mock } from 'mockjs';

const mockRecommendTemplate = {
  recommendId: '@integer(1, 10000)',
  userId: '@guid',
  username: '@first',
  problemId: '@integer(1, 10000)',
  message: '@paragraph',
  updateTime: '@dateTime',
};

export const mockGetRecommendsResp: GetRecommendsResp = mock({
  status: 'success',
  'recommends|1-10': [mockRecommendTemplate],
});

export const mockGetRecommendResp: GetRecommendResp = mock({
  status: 'success',
  recommend: mockRecommendTemplate,
});

export const mockUploadRecommendResp: UploadRecommendResp = mockGetRecommendResp;
