import { fetcher } from './fetcher';
import {
  IGetCardsResponse,
  IAddCardResponse,
  IVerifyCardRequest,
  IVerifyCardResponse,
  ISetMainCardRequest,
  ISetMainCardResponse,
  IDeleteCardRequest,
  IDeleteCardResponse,
} from '@/shared/types/card';

export async function getCards(): Promise<IGetCardsResponse> {
  return fetcher<IGetCardsResponse>('/user/card/get', {
    method: 'GET',
  });
}

export async function addCard(locale?: string): Promise<IAddCardResponse> {
  let redirectUrl = 'overpack://profile/cards?';
  
  if (typeof window !== 'undefined') {
    const lang = locale || window.location.pathname.split('/')[1] || 'en';
    redirectUrl = `${window.location.origin}/${lang}/profile/cards?`;
  }
  
  return fetcher<IAddCardResponse>('user/card/add', {
    method: 'POST',
    body: JSON.stringify({
      redirectUrl,
    }),
  });
}

export async function verifyCard(data: IVerifyCardRequest): Promise<IVerifyCardResponse> {
  const redirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/profile/cards?`
    : 'overpack://profile/cards?';
  
  return fetcher<IVerifyCardResponse>('/user/card/verify', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      redirectUrl,
    }),
  });
}

export async function setMainCard(data: ISetMainCardRequest): Promise<ISetMainCardResponse> {
  return fetcher<ISetMainCardResponse>('/user/card/set/main', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCard(data: IDeleteCardRequest): Promise<IDeleteCardResponse> {
  return fetcher<IDeleteCardResponse>('/user/card/delete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

