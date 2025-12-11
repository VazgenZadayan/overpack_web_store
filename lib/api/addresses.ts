import { IBaseSuccessResponse } from '@/shared/types/common';
import { fetcher } from './fetcher';
import type {
  IGetAddresses,
  IAddAddress,
  IDeleteAddress,
  ISetMainAddress,
} from '@/shared/types/address';

export async function getAddresses(): Promise<IGetAddresses> {
  return fetcher<IGetAddresses>('/user/address', {
    method: 'GET',
  });
}

export async function addAddress(data: IAddAddress): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/address/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(data: IDeleteAddress): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/address/delete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function setMainAddress(data: ISetMainAddress): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/address/set-main', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}




