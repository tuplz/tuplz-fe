import {
  GetCommentResp,
  GetCommentsResp,
  UploadCommentResp,
} from '@/components/types';
import { mock } from 'mockjs';

const mockCommentTemplate = {
  commentId: '@increment',
  updateTime: '@dateTime',
  commentContent: '@paragraph',
  userId: '@guid',
  username: '@first',
  replyTo: '@integer(0, 10)',
};

export const mockGetCommentsResp: GetCommentsResp = mock({
  status: 'success',
  'comments|0-20': [mockCommentTemplate],
});

export const mockGetCommentResp: GetCommentResp = mock({
  status: 'success',
  comment: mockCommentTemplate,
});

export const mockUploadCommentResp: UploadCommentResp = mockGetCommentResp;
