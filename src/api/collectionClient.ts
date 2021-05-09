import {
  CreateCollectionReq,
  CreateCollectionResp,
  GetCollectionReq,
  GetCollectionResp,
  GetCollectionsReq,
  GetCollectionsResp,
} from '@/components/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { collectionsApiUrl } from '@/utils/config';
import {
  mockGetCollectionsResp,
  mockGetCollectionResp,
  mockCreateCollectionResp,
} from '@/api/mock';

const getCollections = (req: GetCollectionsReq): Promise<GetCollectionsResp> =>
  new Promise((resolve, reject) => {
    axios
      .get<void, AxiosResponse<GetCollectionsResp>>(`${collectionsApiUrl}`, {
        params: req,
      })
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

const createCollection = (
  req: CreateCollectionReq
): Promise<CreateCollectionResp> =>
  new Promise((resolve, reject) => {
    axios
      .post<CreateCollectionReq, AxiosResponse<CreateCollectionResp>>(
        `${collectionsApiUrl}`,
        req
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockCreateCollectionResp)
          : reject(err);
      });
  });

const collectionClient = {
  getCollections,
  getCollection,
  createCollection,
};

export default collectionClient;
