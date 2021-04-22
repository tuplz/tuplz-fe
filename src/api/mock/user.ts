import {
  GetUserProfileResp,
  SendVerifyEmailResp,
  UserLoginResp,
  VerifyEmailResp,
} from '@/components/types';
import { mock } from 'mockjs';

export const mockUserLoginResp: UserLoginResp = mock({
  status: 'success',
  id: '@guid',
  key: '@guid',
});

export const mockGetUserProfileResp: GetUserProfileResp = mock({
  status: 'success',
  user: {
    userId: '@guid',
    username: '@first',
    email: '@email',
    isVerified: '@boolean',
  },
});

export const mockSendVerifyEmailResp: SendVerifyEmailResp = mock({
  status: 'success',
});

export const mockVerifyEmailResp: VerifyEmailResp = mockSendVerifyEmailResp;
