import { IBaseSuccessResponse } from './common';

export interface IPartner {
  id: number;
  name: string;
  workingHours: string;
  address: string;
  phone: string;
  image: string;
  images: string;
  description: string;
}

export interface IGetPartnersResponse extends IBaseSuccessResponse {
  data: {
    partners: IPartner[];
  };
}

