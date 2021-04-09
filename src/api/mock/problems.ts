import { GetProblemsResp, GetProblemResp } from '@/components/types';
import { mock } from 'mockjs';

const mockProblemTemplate = {
  id: '@integer(1, 10000)',
  like: '@integer(1, 10000)',
  dislike: '@integer(1, 10000)',
  visit: '@integer(1, 10000)',
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
    id: '@title(1, 6)',
    title: '@title(1, 6)',
    type: '@title(1, 6)',
    description: '@paragraph',
    'sample|1-3': [{
      input: '@title(1, 6)',
      output: '@title(1, 6)',
      explanation: '@title(1, 6)',
      misc: '@title(1, 6)',
    }],
    'tags|1': [
      ['naive'],
      ['easy'],
      ['normal'],
      ['hard'],
      ['@word'],
      ['easy', '@word'],
      ['normal', '@word', '@word'],
    ],
    rules: {
      'runtime|1-1000': 1,
      'memory|1-1000': 1,
      'stack|1-1000': 1,
      'source|1-1000': 1,
    },
    meta: {
      created: '@datetime',
      updated: '@datetime',
      checked: '@datetime',
    },
    misc: '@title(1, 6)'
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
