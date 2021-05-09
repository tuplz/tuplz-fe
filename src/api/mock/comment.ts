import {
  GetCommentResp,
  GetCommentsResp,
  UploadCommentResp,
} from '@/components/types';
import { mock } from 'mockjs';

const mockCommentTemplate = {
  commentId: '@integer(1, 5)',
  commentTime: '@dateTime',
  commentContent: '@paragraph',
  userId: '@guid',
  username: '@first',
  replyTo: '@integer(1, 10)',
};

export const mockGetCommentsResp: GetCommentsResp = mock({
  status: 'success',
  'comments|1-20': [
    {
      'commentId|+1': 1,
      commentTime: '@dateTime',
      commentContent: '@paragraph',
      userId: '@guid',
      username: '@first',
      replyTo: '@integer(-1, 0)',
      isReply: false,
    },
  ],
});

export const mockGetCommentResp: GetCommentResp = mock({
  status: 'success',
  comment: mockCommentTemplate,
});

export const mockUploadCommentResp: UploadCommentResp = mockGetCommentResp;
