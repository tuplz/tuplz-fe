import { Ref } from 'vue';

export interface Comment {
  commentId: number;
  updateTime: string;
  commentContent: string;
  userId: string;
  username: string;
  replyTo: number;
  reply?: {
    data: CommentForm;
    commentForm: Ref;
    visible: boolean;
  };
}

export interface CommentForm {
  recommendId?: number;
  commentContent: string;
  replyTo?: number;
}
