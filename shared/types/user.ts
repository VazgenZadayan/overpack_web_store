import { IBaseSuccessResponse } from './common';
import { IUserType } from './auth';

export interface IUser {
  id: number;
  name: string;
  phone: string;
  documentNumber: string | number | null;
  type: IUserType;
  status: number;
  createdAt: string;
}

export interface IGetMeResponse extends IBaseSuccessResponse {
  data: {
    user: IUser;
  };
}




