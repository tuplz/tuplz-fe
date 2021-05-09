import { CollectionForm, PasswordForm, RecommendForm, UserForm } from '.';

interface ReqHeader {
  userId: string;
}

export interface GetProblemsReq {
  maxLength: number;
}

export interface GetProblemReq {
  id: number;
}

export type GetProblemRecommendsReq = GetProblemReq;

export interface UploadRecommendReq
  extends ReqHeader,
    Required<RecommendForm> {}

export interface UserLoginReq {
  username: string;
  password: string;
}

export interface UserRegisterReq extends UserLoginReq {
  email: string;
}

export interface ChangePasswordReq extends ReqHeader, PasswordForm {}

export type GetUserProfileReq = ReqHeader;

export interface EditUserProfileReq extends ReqHeader, UserForm {}

export interface SendVerifyEmailReq extends ReqHeader {
  email: string;
}

export interface VerifyEmailReq extends SendVerifyEmailReq {
  verifyCode: string;
}

export type GetCollectionsReq = ReqHeader;

export interface GetCollectionReq {
  collectionId: number;
}

export interface CreateCollectionReq extends ReqHeader, CollectionForm {}

export type DeleteCollectionReq = GetCollectionReq;

export interface EditCollectionReq
  extends CreateCollectionReq,
    DeleteCollectionReq {}
