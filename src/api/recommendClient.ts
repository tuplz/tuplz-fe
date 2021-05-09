import {
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetRecommendsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl, recommendsApiUrl } from '@/utils/config';
import { mockGetRecommendsResp, mockUploadRecommendResp } from '@/api/mock';

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

const recommendClient = {
  getRecommends,
  getProblemRecommends,
  uploadRecommend,
};

export default recommendClient;
