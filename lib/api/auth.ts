import { API } from '@/lib/constants';
import type { IBaseSuccessResponse } from '@/shared/types/common';
import type {
  ISendSMSRequest,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IVerifySMSReQuest,
  IVerifySMSResponse,
} from '@/shared/types/auth';

async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof document !== 'undefined' 
    ? getCookie('token') 
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { token }),
  };

  const lang = typeof document !== 'undefined'
    ? document.documentElement.lang || 'en'
    : 'en';
  const apiLanguage = lang === 'hy' ? 'am' : lang;
  headers['Accept-Language'] = apiLanguage;

  const response = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function sendSMSToUser(data: ISendSMSRequest): Promise<IBaseSuccessResponse> {
  return fetchAPI<IBaseSuccessResponse>('user/sms/send', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
    }),
  });
}

export async function verifySMS(data: IVerifySMSReQuest): Promise<IVerifySMSResponse> {
  return fetchAPI<IVerifySMSResponse>('user/sms/verify', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
      code: data.code,
    }),
  });
}

export async function signUp(data: ISignUpRequest): Promise<IBaseSuccessResponse> {
  return fetchAPI<IBaseSuccessResponse>('user/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function signIn(data: ISignInRequest): Promise<ISignInResponse> {
  return fetchAPI<ISignInResponse>('user/auth', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
      code: data.code,
    }),
  });
}

