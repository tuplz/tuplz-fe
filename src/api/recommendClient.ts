import {
  GetRecommendReq,
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetRecommendResp,
  GetRecommendsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl, recommendsApiUrl } from '@/utils/config';
import {
  mockGetRecommendResp,
  mockGetRecommendsResp,
  mockUploadRecommendResp,
} from '@/api/mock';

const getRecommend = (req: GetRecommendReq): Promise<GetRecommendResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetRecommendResp>>(
        `${recommendsApiUrl}/${req.recommendId}`, {
        params: req,
      })
        params: req,
      })
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
      .then((resp: AxiosResponse<GetRecommendsResp>) => {
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
      .then((resp: AxiosResponse<GetProblemRecommendsResp>) => {
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
      .then((resp: AxiosResponse<UploadRecommendResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUploadRecommendResp)
          : reject(err);
      });
  });

const recommendClient = {
  getRecommend,
  getRecommends,
  getProblemRecommends,
  uploadRecommend,
};

export default recommendClient;
