import {
  UserLoginReq,
  UserLoginResp,
  UserRegisterReq,
  UserRegisterResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { userApiUrl } from '@/utils/config';
import { mockUserLoginResp } from '@/api/mock';

const userLogin = (req: UserLoginReq): Promise<UserLoginResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<UserLoginReq, AxiosResponse<UserLoginResp>>(
        `${userApiUrl}/login`,
        req
      )
      .then((resp: AxiosResponse<UserLoginResp>) => {
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
      .then((resp: AxiosResponse<UserRegisterResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUserLoginResp)
          : reject(err);
      });
  });

const userClient = {
  userLogin,
  userRegister,
};

export default userClient;
