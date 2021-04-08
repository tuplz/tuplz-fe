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
  updTime: '@datetime',
  content: {
    title: '@title(1, 6)',
    description: '@paragraph',
    inputFormat: '@sentence',
    outputFormat: '@sentence',
  },
};

export const mockGetProblemsResp: GetProblemsResp = mock({
  'prob|1-500': [mockProblemTemplate],
});

export const mockGetProblemResp: GetProblemResp = mock({
  prob: mockProblemTemplate,
});
