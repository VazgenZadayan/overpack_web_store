import { IBaseSuccessResponse } from '../types';

export type IUserType = 1 | 2;

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

export interface IRegistrationFormData {
  phone: {
    countryCode?: string;
    phoneNumber?: string;
  };
  checkbox: boolean;
  code: string;
  name: string;
  type: IUserType;
  documentNumber?: string;
}



