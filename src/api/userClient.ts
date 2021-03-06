import {
  ChangePasswordReq,
  ChangePasswordResp,
  EditUserProfileReq,
  EditUserProfileResp,
  GetUserProfileReq,
  GetUserProfileResp,
  SendVerifyEmailReq,
  SendVerifyEmailResp,
  UserLoginReq,
  UserLoginResp,
  UserRegisterReq,
  UserRegisterResp,
  VerifyEmailReq,
  VerifyEmailResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '@/store';
import { userApiUrl, usersApiUrl } from '@/utils/config';
import {
  mockChangePasswordResp,
  mockEditUserProfileResp,
  mockGetUserProfileResp,
  mockSendVerifyEmailResp,
  mockUserLoginResp,
  mockUserRegisterResp,
  mockVerifyEmailResp,
} from '@/api/mock';

const setAuthHeader = (): void => {
  const key = store.state.token;
  if (key) axios.defaults.headers.common['Authorization'] = `Bearer ${key}`;
};

const removeAuthHeader = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};

const userLogin = (req: UserLoginReq): Promise<UserLoginResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<UserLoginReq, AxiosResponse<UserLoginResp>>(
        `${userApiUrl}/login`,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUserLoginResp)
          : reject(err);
      });
  });

const userRegister = (req: UserRegisterReq): Promise<UserRegisterResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<UserRegisterReq, AxiosResponse<UserRegisterResp>>(
        `${userApiUrl}/register`,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUserRegisterResp)
          : reject(err);
      });
  });

const changePassword = (req: ChangePasswordReq): Promise<ChangePasswordResp> =>
  new Promise((resolve, reject) => {
    const { userId, ...reqBody } = req;
    axios
      .patch<void, AxiosResponse<ChangePasswordResp>>(
        `${usersApiUrl}/${userId}`,
        reqBody
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockChangePasswordResp)
          : reject(err);
      });
  });

const getUserProfile = (req: GetUserProfileReq): Promise<GetUserProfileResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetUserProfileResp>>(
        `${usersApiUrl}/${req.userId}`
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetUserProfileResp)
          : reject(err);
      });
  });

const editUserProfile = (
  req: EditUserProfileReq
): Promise<EditUserProfileResp> =>
  new Promise((resolve, reject) => {
    const { userId, ...reqBody } = req;
    axios
      .patch<void, AxiosResponse<EditUserProfileResp>>(
        `${usersApiUrl}/${userId}`,
        reqBody
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockEditUserProfileResp)
          : reject(err);
      });
  });

const sendVerifyEmail = (
  req: SendVerifyEmailReq
): Promise<SendVerifyEmailResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<SendVerifyEmailReq, AxiosResponse<SendVerifyEmailResp>>(
        `${userApiUrl}/verify/email`,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockSendVerifyEmailResp)
          : reject(err);
      });
  });

const verifyEmail = (req: VerifyEmailReq): Promise<VerifyEmailResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<VerifyEmailReq, AxiosResponse<VerifyEmailResp>>(
        `${userApiUrl}/verify/user`,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockVerifyEmailResp)
          : reject(err);
      });
  });

const userClient = {
  setAuthHeader,
  removeAuthHeader,
  userLogin,
  userRegister,
  changePassword,
  getUserProfile,
  editUserProfile,
  sendVerifyEmail,
  verifyEmail,
};

export default userClient;
