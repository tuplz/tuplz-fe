import {
  GetRecommendsResp,
  GetRecommendResp,
  UploadRecommendResp,
} from '@/components/types';
import { mockStatusTemplate } from './status';
import { mock } from 'mockjs';

export const mockRecommendTemplate = {
  recommendId: '@integer(1, 10000)',
  userId: '@guid',
  username: '@first',
  problemId: '@integer(1, 10000)',
  message: '@paragraph',
  updateTime: '@dateTime',
};

export const mockGetRecommendsResp: GetRecommendsResp = mock({
  ...mockStatusTemplate,
  'recommends|1-10': [mockRecommendTemplate],
});

export const mockGetRecommendResp: GetRecommendResp = mock({
  ...mockStatusTemplate,
  recommend: mockRecommendTemplate,
});

export const mockUploadRecommendResp: UploadRecommendResp = mockGetRecommendResp;
