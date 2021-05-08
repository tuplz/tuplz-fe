import {
  GetProblemsReq,
  GetProblemsResp,
  GetProblemReq,
  GetProblemResp,
  AddFavouriteReq,
  AddFavouriteResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl } from '@/utils/config';
import {
  mockGetProblemsResp,
  mockGetProblemResp,
  mockAddFavouriteResp,
} from '@/api/mock';

const getProblems = (req: GetProblemsReq): Promise<GetProblemsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetProblemsResp>>(problemsApiUrl, {
        params: req,
      })
      .then((resp: AxiosResponse<GetProblemsResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetProblemsResp)
          : reject(err);
      });
  });

const getProblem = (req: GetProblemReq): Promise<GetProblemResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetProblemResp>>(`${problemsApiUrl}/${req.id}`)
      .then((resp: AxiosResponse<GetProblemResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetProblemResp)
          : reject(err);
      });
  });

const addFavourite = (req: AddFavouriteReq): Promise<AddFavouriteResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<AddFavouriteReq, AxiosResponse<AddFavouriteResp>>(
        problemsApiUrl,
        req
      )
      .then((resp: AxiosResponse<AddFavouriteResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockAddFavouriteResp)
          : reject(err);
      });
  });

const problemClient = {
  getProblems,
  getProblem,
  addFavourite,
};

export default problemClient;
