import {
  UserLoginReq,
  UserLoginResp,
  UserRegisterReq,
  UserRegisterResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { userApiUrl } from '@/utils/config';
import { mockUserLoginResp } from '@/api/mock';

// FIXME: remove mock data
const userLogin = (req: UserLoginReq): Promise<UserLoginResp> =>
  new Promise((resolve, _reject) => {
    axios
      .post<UserLoginReq, AxiosResponse<UserLoginResp>>(
        `${userApiUrl}/login`,
        req
      )
      .then((resp: AxiosResponse<UserLoginResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockUserLoginResp);
        // reject(err);
      });
  });

// FIXME: remove mock data
const userRegister = (req: UserRegisterReq): Promise<UserRegisterResp> =>
  new Promise((resolve, _reject) => {
    axios
      .post<UserRegisterReq, AxiosResponse<UserRegisterResp>>(
        `${userApiUrl}/register`,
        req
      )
      .then((resp: AxiosResponse<UserRegisterResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockUserLoginResp);
        // reject(err);
      });
  });

const userClient = {
  userLogin,
  userRegister,
};

export default userClient;
