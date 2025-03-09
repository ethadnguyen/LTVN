import { post } from '../api_client';

export const login = async (data: any) => {
  const res = await post('/auth/login', data);
  return res;
};

export const logout = async () => {
  const res = await post('/auth/logout');
  return res.data;
};
