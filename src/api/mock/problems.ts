import { GetProblemsResp, GetProblemResp } from '@/components/types';
import { mock } from 'mockjs';

const mockProblemTemplate = {
  'id|1-10000': 1,
  'like|1-10000': 1,
  'dislike|1-10000': 1,
  'visit|1-10000': 1,
  'tags|1': [
    ['naive'],
    ['easy'],
    ['normal'],
    ['hard'],
    ['@word'],
    ['easy', '@word'],
    ['normal', '@word', '@word'],
  ],
  updateTime: '@datetime',
  content: {
    title: '@title(1, 6)',
    description: '@paragraph',
    inputFormat: '@sentence',
    outputFormat: '@sentence',
    sample: '@paragraph',
    constraints: '@paragraph',
  },
};

export const mockGetProblemsResp: GetProblemsResp = mock({
  status: 'success',
  'problems|1-500': [mockProblemTemplate],
});

export const mockGetProblemResp: GetProblemResp = mock({
  status: 'success',
  problem: mockProblemTemplate,
});
