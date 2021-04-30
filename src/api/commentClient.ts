import {
  GetCommentsReq,
  GetCommentsResp,
  UploadCommentReq,
  UploadCommentResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { commentsApiUrl } from '@/utils/config';
import { mockGetCommentsResp, mockUploadCommentResp } from '@/api/mock';

const getComments = (req: GetCommentsReq): Promise<GetCommentsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetCommentsResp>>(commentsApiUrl, {
        params: req,
      })
      .then((resp: AxiosResponse<GetCommentsResp>) => {
        console.log('hi');
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
    axios
      .post<UploadCommentReq, AxiosResponse<UploadCommentResp>>(
        commentsApiUrl,
        req
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

const recommendClient = {
  getComments,
  uploadComment,
};

export default recommendClient;
