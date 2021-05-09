import {
  CreateCollectionReq,
  CreateCollectionResp,
  DeleteCollectionReq,
  DeleteCollectionResp,
  EditCollectionReq,
  EditCollectionResp,
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
  mockEditCollectionResp,
  mockDeleteCollectionResp,
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

const deleteCollection = (
  req: DeleteCollectionReq
): Promise<DeleteCollectionResp> =>
  new Promise((resolve, reject) => {
    axios
      .delete<DeleteCollectionReq, AxiosResponse<DeleteCollectionResp>>(
        `${collectionsApiUrl}/${req.collectionId}`
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockDeleteCollectionResp)
          : reject(err);
      });
  });

const editCollection = (req: EditCollectionReq): Promise<EditCollectionResp> =>
  new Promise((resolve, reject) => {
    const { collectionId, ...reqBody } = req;
    axios
      .put<EditCollectionReq, AxiosResponse<EditCollectionResp>>(
        `${collectionsApiUrl}/${collectionId}`,
        reqBody
      )
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => {
        process.env.NODE_ENV === 'development'
          ? resolve(mockEditCollectionResp)
          : reject(err);
      });
  });

const collectionClient = {
  getCollections,
  getCollection,
  createCollection,
  deleteCollection,
  editCollection,
};

export default collectionClient;
