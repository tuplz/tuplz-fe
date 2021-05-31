import {
  CollectionInfo,
  Collection,
  Comment,
  Problem,
  Recommend,
  User,
} from '.';

export interface AddFavouriteResp extends Status {
  problem: Problem;
}

interface Status {
  code: number;
  status: string;
}

export interface GetProblemsResp extends Status {
  problems: Problem[];
}

export interface GetProblemResp extends Status {
  problem: Problem;
  favourite: boolean;
}

export interface GetRecommendsResp extends Status {
  recommends: Recommend[];
}

export interface GetRecommendResp extends Status {
  recommend: Recommend;
}

export type GetProblemRecommendsResp = GetRecommendsResp;

export type UploadRecommendResp = GetRecommendResp;

export interface UserLoginResp extends Status {
  id: string;
  username: string;
  key: string;
}

export type UserRegisterResp = UserLoginResp;

export type ChangePasswordResp = Status;

export interface GetUserProfileResp extends Status {
  user: User;
}

export type EditUserProfileResp = GetUserProfileResp;

export type SendVerifyEmailResp = Status;

export type VerifyEmailResp = Status;

export interface GetCollectionsResp extends Status {
  collections: CollectionInfo[];
}

export interface GetCollectionResp extends Status {
  collection: Collection;
}

export type CreateCollectionResp = Status;

export type DeleteCollectionResp = Status;

export type EditCollectionResp = Status;

export interface GetCommentResp extends Status {
  comment: Comment;
}

export interface GetCommentsResp extends Status {
  comments: Comment[];
}

export type UploadCommentResp = GetCommentResp;
