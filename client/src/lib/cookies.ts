import { accessToken, refreshToken } from '@/constants';

export const setTokens = (access_token: string, refresh_token: string) => {
  // Lưu access token vào cookie
  document.cookie = `${accessToken}=${access_token}; path=/; max-age=3600`; // 1 hour

  // Lưu refresh token vào cookie
  document.cookie = `${refreshToken}=${refresh_token}; path=/; max-age=2592000`; // 30 days
};

export const removeTokens = () => {
  // Xóa access token
  document.cookie = `${accessToken}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // Xóa refresh token
  document.cookie = `${refreshToken}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
