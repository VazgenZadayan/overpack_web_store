import { fetcher } from './fetcher';
import type { IGetMeResponse } from '@/shared/types/user';
import type { IBaseSuccessResponse } from '@/shared/types/common';

export async function getMe(): Promise<IGetMeResponse> {
  return fetcher<IGetMeResponse>('/user', {
    method: 'GET',
  });
}

export async function deleteUser(): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/delete', {
    method: 'POST',
  });
}

