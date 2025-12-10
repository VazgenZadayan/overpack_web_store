import { fetcher } from './fetcher';
import type { IGetPartnersResponse } from '@/shared/types/partner';

export async function getPartners(): Promise<IGetPartnersResponse> {
  return fetcher<IGetPartnersResponse>('/partners', {
    method: 'GET',
  });
}

