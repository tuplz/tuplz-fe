export interface Comment {
  commentId: number;
  updateTime: string;
  commentContent: string;
  userId: string;
  username: string;
  replyTo: number;
  reply?: {
    data: CommentForm;
    visible: boolean;
  };
}

export interface CommentForm {
  recommendId: number;
  commentContent: string;
  userId?: string;
  replyTo: number;
}
