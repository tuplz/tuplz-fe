import {
  GetRecommendReq,
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetRecommendResp,
  GetRecommendsResp,
  GetRecommendedProblemsReq,
  GetRecommendedProblemsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl, recommendsApiUrl } from '@/utils/config';
import {
  mockGetRecommendResp,
  mockGetRecommendsResp,
  mockUploadRecommendResp,
  mockGetRecommendedProblemsResp,
} from '@/api/mock';

const getRecommend = (req: GetRecommendReq): Promise<GetRecommendResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetRecommendResp>>(
        `${recommendsApiUrl}/${req.recommendId}`
      )
      .then((resp: AxiosResponse<GetRecommendResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetRecommendResp)
          : reject(err);
      });
  });

const getRecommends = (): Promise<GetRecommendsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetRecommendsResp>>(recommendsApiUrl)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetRecommendsResp)
          : reject(err);
      });
  });

const getProblemRecommends = (
  req: GetProblemRecommendsReq
): Promise<GetProblemRecommendsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetProblemRecommendsResp>>(
        `${problemsApiUrl}/${req.id}/recommends`
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetRecommendsResp)
          : reject(err);
      });
  });

const uploadRecommend = (
  req: UploadRecommendReq
): Promise<UploadRecommendResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<UploadRecommendReq, AxiosResponse<UploadRecommendResp>>(
        recommendsApiUrl,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUploadRecommendResp)
          : reject(err);
      });
  });

const getProblems = (
  req: GetRecommendedProblemsReq
): Promise<GetRecommendedProblemsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetRecommendedProblemsResp>>(
        `http://localhost:5000/api/recommendedproblems`,
        {
          params: req,
        }
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetRecommendedProblemsResp)
          : reject(err);
      });
  });

const recommendClient = {
  getRecommend,
  getRecommends,
  getProblemRecommends,
  uploadRecommend,
  getProblems,
};

export default recommendClient;
