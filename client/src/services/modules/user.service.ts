import { get, post } from '../api_client';
import { UserRes } from '../types/response/user_types/user.res';
import { CreateUserReq } from '../types/request/auth_types/create-user.req';

export const getUserById = async (id: number): Promise<UserRes> => {
  const response = await get(`/user/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserReq): Promise<UserRes> => {
  const response = await post('/user', data);
  return response.data;
};
