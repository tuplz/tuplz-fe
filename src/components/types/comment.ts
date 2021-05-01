export interface Comment {
  commentId: number;
  updateTime: string;
  commentContent: string;
  userId: number;
  username: string;
  replyTo: number;
  response: number[];
  isReply: boolean;
}

export interface CommentForm {
  recommendId?: number;
  commentContent: string;
  replyTo?: number;
}
