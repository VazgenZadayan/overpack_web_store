import { fetcher } from './fetcher';
import {
  IOrderHistoryResponse,
  IOrderHistoryRequest,
} from '@/shared/types/order';

export async function getOrderHistory(params: IOrderHistoryRequest): Promise<IOrderHistoryResponse> {
  const { limit, page } = params;
  return fetcher<IOrderHistoryResponse>(`/order?limit=${limit}&page=${page}`, {
    method: 'GET',
  });
}

