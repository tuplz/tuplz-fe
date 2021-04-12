import {
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  // GetRecommendsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { problemsApiUrl, recommendsApiUrl } from '@/utils/config';
// import { mockGetRecommendsResp, mockUploadRecommendResp } from '@/api/mock';

// const getRecommends = (
//   req: GetRecommendsReq
// ): Promise<GetRecommendsResp> =>
//   new Promise((resolve, reject) => {
//     axios
//       .get<GetRecommendsReq, AxiosResponse<GetRecommendsResp>>(recommendsApiUrl, {
//           params: req,
//         })
//       .then((resp: AxiosResponse<GetRecommendsResp>) => {
//         resolve(resp.data);
//       })
//       .catch((err: AxiosError) => {
//         // resolve(mockGetRecommendsResp);
//         reject(err);
//       });
//   });

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
        // resolve(mockGetRecommendsResp);
        reject(err);
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
        // resolve(mockUploadRecommendResp);
        reject(err);
      });
  });

const recommendClient = {
  // getRecommends,
  getProblemRecommends,
  uploadRecommend,
};

export default recommendClient;
