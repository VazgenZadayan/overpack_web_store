import { IBaseSuccessResponse } from '../types';

export type IUserType = 'client' | 'partner';

export interface ISendSMSRequest {
  phone: string;
}

export interface IVerifySMSReQuest {
  phone: string;
  code: string;
}

export interface IVerifySMSResponse extends IBaseSuccessResponse {
  data: {
    userExists: boolean;
  };
}

export interface ISignUpRequest {
  documentNumber?: string;
  phone: string;
  name: string;
  type: IUserType;
}

export interface ISignInRequest {
  phone: string;
  code: string;
}

export interface ISignInResponse extends IBaseSuccessResponse {
  data: {
    token: string;
  };
}



