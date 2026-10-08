import api from './api';
import type { IResponseEntity } from '../types/api';
import type { ILoginResponse } from '../types/auth';

export const login = async (
  username: string,
  password: string,
): Promise<IResponseEntity<ILoginResponse>> => {
  const response = await api.post<IResponseEntity<ILoginResponse>>(
    '/auth/login',
    {
      username,
      password,
    },
  );

  return response.data;
};
