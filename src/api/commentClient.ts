import {
  GetCommentsReq,
  GetCommentsResp,
  UploadCommentReq,
  UploadCommentResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { recommendsApiUrl } from '@/utils/config';
import { mockGetCommentsResp, mockUploadCommentResp } from '@/api/mock';

const getComments = (req: GetCommentsReq): Promise<GetCommentsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetCommentsResp>>(
        `${recommendsApiUrl}/${req.recommendId}/comments`
      )
      .then((resp: AxiosResponse<GetCommentsResp>) => {
        console.log(resp.data);
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetCommentsResp)
          : reject(err);
      });
  });

const uploadComment = (req: UploadCommentReq): Promise<UploadCommentResp> =>
  new Promise((resolve, reject) => {
    const { recommendId, ...reqBody } = req;
    axios
      .post<UploadCommentReq, AxiosResponse<UploadCommentResp>>(
        `${recommendsApiUrl}/${recommendId}/comments`,
        reqBody
      )
      .then((resp: AxiosResponse<UploadCommentResp>) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockUploadCommentResp)
          : reject(err);
      });
  });

const commentClient = {
  getComments,
  uploadComment,
};

export default commentClient;
