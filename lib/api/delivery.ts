import { fetcher } from './fetcher';
import { IBaseSuccessResponse } from '@/shared/types/common';

export interface IGetCourierPhoneRequest {
  orderId: number;
}

export interface ICourierPhoneData {
  phone: string;
  ext: string;
  ttl: number;
}

export interface IGetCourierPhoneResponse extends IBaseSuccessResponse {
  data: ICourierPhoneData;
}

export async function getCourierPhone(params: IGetCourierPhoneRequest): Promise<IGetCourierPhoneResponse> {
  const { orderId } = params;
  return fetcher<IGetCourierPhoneResponse>(`/delivery/courier-phone?orderId=${orderId}`, {
    method: 'GET',
  });
}

