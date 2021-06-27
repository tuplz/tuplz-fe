import {
  GetProblemsResp,
  GetProblemResp,
  GetRecommendedProblemsResp,
} from '@/components/types';
import { mockStatusTemplate } from './status';
import { mock } from 'mockjs';

export const mockProblemTemplate = {
  id: '@integer(1, 10000)',
  like: '@integer(1, 10000)',
  dislike: '@integer(1, 10000)',
  visit: '@integer(1, 10000)',
  favourite: false,
  content: {
    title: '@title(1, 6)',
    type: '@title(1, 6)',
    'sections|1-3': [
      {
        title: '@title(1, 6)',
        content: '@paragraph',
        misc: '@sentence',
      },
    ],
    'tags|1': [
      ['naive', '@word'],
      ['easy', '@word'],
      ['normal', '@word'],
      ['hard', '@word'],
      ['@word', '@word'],
    ],
    'samples|1-3': [
      {
        input: '@sentence',
        output: '@sentence',
        explanation: '@paragraph',
        misc: '@sentence',
      },
    ],
    rules: {
      runtime: '@integer(1000000000, 10000000000)',
      memory: '@integer(100000000, 1000000000)',
      stack: '@integer(100000000, 1000000000)',
      source: '@integer(10000, 100000)',
    },
    meta: {
      created: '@datetime',
      updated: '@datetime',
      checked: '@datetime',
    },
    misc: '@sentence',
  },
};

export const mockGetProblemsResp: GetProblemsResp = mock({
  ...mockStatusTemplate,
  'problems|1-500': [mockProblemTemplate],
});

export const mockGetProblemResp: GetProblemResp = mock({
  ...mockStatusTemplate,
  problem: mockProblemTemplate,
});

export const mockAddFavouriteResp: GetProblemResp = mock({
  status: 'success',
  problem: mockProblemTemplate,
});

export const mockGetRecommendedProblemsResp: GetRecommendedProblemsResp = mock({
  ...mockStatusTemplate,
  'problems|1-500': [mockProblemTemplate],
});
