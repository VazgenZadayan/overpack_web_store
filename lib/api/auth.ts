import { fetcher } from './fetcher';
import type { IBaseSuccessResponse } from '@/shared/types/common';
import type {
  ISendSMSRequest,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IVerifySMSReQuest,
  IVerifySMSResponse,
} from '@/shared/types/auth';

export async function sendSMSToUser(data: ISendSMSRequest): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/sms/send', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
    }),
  });
}

export async function verifySMS(data: IVerifySMSReQuest): Promise<IVerifySMSResponse> {
  return fetcher<IVerifySMSResponse>('/user/sms/verify', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
      code: data.code,
    }),
  });
}

export async function signUp(data: ISignUpRequest): Promise<IBaseSuccessResponse> {
  return fetcher<IBaseSuccessResponse>('/user/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function signIn(data: ISignInRequest): Promise<ISignInResponse> {
  return fetcher<ISignInResponse>('/user/auth', {
    method: 'POST',
    body: JSON.stringify({
      phone: data.phone,
      code: data.code,
    }),
  });
}

