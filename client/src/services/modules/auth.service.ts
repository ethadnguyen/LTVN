import { post } from '../api-client';

export const login = async (data: any) => {
  const res = await post('/auth/login', data);
  console.log('res', res);
  return res;
};

export const register = async (data: any) => {
  const res = await post('/auth/register', data);
  return res.data;
};

export const logout = async () => {
  const res = await post('/auth/logout');
  return res.data;
};
