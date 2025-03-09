export interface LoginPayload {
  token_id: string;
  user_id: string;
  roles: string[];
  permissions: string[];
  user_name: string;
}

export interface LoginRes {
  payload: LoginPayload;
  access_token: string;
  refresh_token: string;
}
