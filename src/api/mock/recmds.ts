import { GetRecmdsResp } from '@/components/types';
import { mock } from 'mockjs';

export const mockGetRecmdsResp: GetRecmdsResp = mock({
  'recmd|1-10': [
    {
      userId: '@title(1, 1)',
      probId: '@title(1, 6)',
      recmdId: '@title(1, 6)',
      message: '@paragraph(1, 6)',
      updTime: '@dateTime'
    },
  ],
});