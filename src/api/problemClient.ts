import {
  GetProblemsReq,
  GetProblemsResp,
  GetProblemReq,
  GetProblemResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl } from '@/utils/config';
import { mockGetProblemsResp, mockGetProblemResp } from '@/api/mock/problems';

// FIXME: remove mock data
const getProblems = (req: GetProblemsReq): Promise<GetProblemsResp> =>
  new Promise((resolve, _reject) => {
    axios
      .get<void, AxiosResponse<GetProblemsResp>>(problemsApiUrl, {
        params: req,
      })
      .then((resp: AxiosResponse<GetProblemsResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockGetProblemsResp);
        // reject(err);
      });
  });

// FIXME: remove mock data
const getProblem = (req: GetProblemReq): Promise<GetProblemResp> =>
  new Promise((resolve, _reject) => {
    axios
      .get<GetProblemReq, AxiosResponse<GetProblemResp>>(problemsApiUrl, {
        params: req,
      })
      .then((resp: AxiosResponse<GetProblemResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockGetProblemResp);
        // reject(err);
      });
  });

const problemClient = {
  getProblems,
  getProblem,
};

export default problemClient;
