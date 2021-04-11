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

// FIXME: remove mock data
const getRecommends = (): Promise<GetRecommendsResp> =>
  new Promise((resolve, _reject) => {
    axios
      .get<void, AxiosResponse<GetRecommendsResp>>(recommendsApiUrl)
      .then((resp: AxiosResponse<GetRecommendsResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockGetRecommendsResp);
        // reject(err);
      });
  });

// FIXME: remove mock data
const getProblemRecommends = (
  req: GetProblemRecommendsReq
): Promise<GetProblemRecommendsResp> =>
  new Promise((resolve, _reject) => {
    axios
      .get<void, AxiosResponse<GetProblemRecommendsResp>>(
        `${problemsApiUrl}/${req.id}/recommends`
      )
      .then((resp: AxiosResponse<GetProblemRecommendsResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockGetRecommendsResp);
        // reject(err);
      });
  });

// FIXME: remove mock data
const uploadRecommend = (
  req: UploadRecommendReq
): Promise<UploadRecommendResp> =>
  new Promise((resolve, _reject) => {
    axios
      .post<UploadRecommendReq, AxiosResponse<UploadRecommendResp>>(
        recommendsApiUrl,
        req
      )
      .then((resp: AxiosResponse<UploadRecommendResp>) => {
        resolve(resp.data);
      })
      .catch((_err: AxiosError) => {
        resolve(mockUploadRecommendResp);
        // reject(err);
      });
  });

const recommendClient = {
  getRecommends,
  getProblemRecommends,
  uploadRecommend,
};

export default recommendClient;
