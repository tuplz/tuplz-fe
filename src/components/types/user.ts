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

export interface PasswordForm {
  originalPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
