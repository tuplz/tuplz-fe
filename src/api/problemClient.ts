import {
  GetProblemsResp,
  GetProblemReq,
  GetProblemResp,
} from '@/components/types';
import { getProblemsApiUrl } from '@/utils/config';
import { mockGetProblemResp } from '@/api/mock/problems';
import axios, { AxiosError, AxiosResponse } from 'axios';

// FIXME: remove mock data
const getProblems = (): Promise<GetProblemsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetProblemsResp>>(getProblemsApiUrl)
      .then((resp: AxiosResponse<GetProblemsResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => reject(err));
  });

const getProblem = (req: GetProblemReq): Promise<GetProblemResp> =>
  new Promise((resolve, _reject) => {
    resolve(mockGetProblemResp);
    console.log('mocking...');
    console.log(req);
    console.log(mockGetProblemResp);
    // axios
    //   .get<GetProblemReq, AxiosResponse<GetProblemResp>>(getProblemApiUrl, {
    //     params: req,
    //   })
    //   .then((resp: AxiosResponse<GetProblemResp>) => {
    //     resolve(resp.data);
    //   })
    //   .catch((err: AxiosError) => reject(err));
  });

const problemClient = {
  getProblems,
  getProblem,
};

export default problemClient;
