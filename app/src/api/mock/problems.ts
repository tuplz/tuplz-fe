import { GetProblemsResp } from '@/components/types';
import { mock } from 'mockjs';

export const mockGetProblemsResp: GetProblemsResp = mock({
  'problems|1-500': [
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
