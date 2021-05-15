import {
  ChangePasswordResp,
  EditUserProfileResp,
  GetUserProfileResp,
  SendVerifyEmailResp,
  UserLoginResp,
  UserRegisterResp,
  VerifyEmailResp,
} from '@/components/types';
import { mockStatusTemplate } from './status';
import { mock } from 'mockjs';

export const mockUserLoginResp: UserLoginResp = mock({
  ...mockStatusTemplate,
  id: '@guid',
  key: '@guid',
});

export const mockUserRegisterResp: UserRegisterResp = mockUserLoginResp;

export const mockChangePasswordResp: ChangePasswordResp = mockStatusTemplate;

export const mockGetUserProfileResp: GetUserProfileResp = mock({
  ...mockStatusTemplate,
  user: {
    userId: '@guid',
    username: '@first',
    email: '@email',
    isVerified: '@boolean',
  },
});

export const mockEditUserProfileResp: EditUserProfileResp = mockGetUserProfileResp;

export const mockSendVerifyEmailResp: SendVerifyEmailResp = mock({
  ...mockStatusTemplate,
});

export const mockVerifyEmailResp: VerifyEmailResp = mockSendVerifyEmailResp;
