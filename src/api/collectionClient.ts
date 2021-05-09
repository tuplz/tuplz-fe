import {
  GetCollectionReq,
  GetCollectionResp,
  GetCollectionsReq,
  GetCollectionsResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { collectionsApiUrl, usersApiUrl } from '@/utils/config';
import { mockGetCollectionsResp, mockGetCollectionResp } from '@/api/mock';

const getCollections = (req: GetCollectionsReq): Promise<GetCollectionsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetCollectionsResp>>(
        `${usersApiUrl}/${req.userId}/collections`
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetCollectionsResp)
          : reject(err);
      });
  });

const getCollection = (req: GetCollectionReq): Promise<GetCollectionResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetCollectionResp>>(
        `${collectionsApiUrl}/${req.collectionId}`
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockGetCollectionResp)
          : reject(err);
      });
  });

const collectionClient = {
  getCollections,
  getCollection,
};

export default collectionClient;
