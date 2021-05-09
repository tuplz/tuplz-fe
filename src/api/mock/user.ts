import {
  GetUserProfileResp,
  SendVerifyEmailResp,
  UserLoginResp,
  VerifyEmailResp,
} from '@/components/types';
import { mock } from 'mockjs';

const mockStatusTemplate = {
  code: 200,
  status: 'success',
};

export const mockUserLoginResp: UserLoginResp = mock({
  ...mockStatusTemplate,
  id: '@guid',
  key: '@guid',
});

export const mockGetUserProfileResp: GetUserProfileResp = mock({
  ...mockStatusTemplate,
  user: {
    userId: '@guid',
    username: '@first',
    email: '@email',
    isVerified: '@boolean',
  },
});

export const mockSendVerifyEmailResp: SendVerifyEmailResp = mock({
  ...mockStatusTemplate,
});

export const mockVerifyEmailResp: VerifyEmailResp = mockSendVerifyEmailResp;
