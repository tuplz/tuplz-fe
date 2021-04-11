import { UserLoginResp } from '@/components/types';
import { mock } from 'mockjs';

export const mockUserLoginResp: UserLoginResp = mock({
  status: 'success',
  id: '@guid',
});
