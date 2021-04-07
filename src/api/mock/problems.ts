import { GetProblemsResp, GetProblemContentResp } from '@/components/types';
import { mock } from 'mockjs';

export const mockGetProblemsResp: GetProblemsResp = mock({
  'prob|1-500': [
    {
      'problemId|1-2000': 1,
      problemName: '@title(1, 6)',
      'tags|1': [
        ['naive'],
        ['easy'],
        ['normal'],
        ['hard'],
        ['unknown'],
        ['foo'],
        ['bar'],
      ],
      updateTime: '@datetime',
    },
  ],
});

export const mockGetProblemContentResp: GetProblemContentResp = mock({
  'prob': 
    {
      id:'1001',
      content: {
        title: '@title(1, 6)',
        'tags|1': [
          ['naive'],
          ['easy'],
          ['normal'],
          ['hard'],
          ['unknown'],
          ['foo'],
          ['bar'],
        ],
        description: 'Hello World!',
        inputFormat: 'input format',
        outputFormat: 'output format',
        sample: 'sample',
        con : 'cons and limits'
      },
      updateTime: '@datetime',
    },
});
