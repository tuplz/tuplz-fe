import { UserLoginReq, UserLoginResp } from '@/components/types';
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

const userClient = {
  userLogin,
};

export default userClient;
