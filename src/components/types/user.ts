export interface User {
  userId: string;
  username: string;
  email: string;
  isVerified: boolean;
}

export interface UserForm {
  username: string;
  email: string;
}
