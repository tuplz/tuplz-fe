import {
  GetRecommendsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { recommendsApiUrl } from '@/utils/config';
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
  uploadRecommend,
};

export default recommendClient;
