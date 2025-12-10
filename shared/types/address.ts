import { IBaseSuccessResponse } from './common';

export interface IAddress {
  id: number;
  userId: number;
  isMain: number;
  address: string;
  entrance: number;
  apartment: number;
  floor: number;
  intercom: string;
  other: string | null;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface IGetAddresses extends IBaseSuccessResponse {
  data: {
    addresses: IAddress[];
  };
}

export interface IAddAddress {
  address: string;
  entrance: number;
  apartment: number;
  floor?: number;
  intercom?: string;
  other?: string;
  latitude?: number;
  longitude?: number;
}

export interface IDeleteAddress {
  id: number;
}

export interface ISetMainAddress {
  address: number;
}

export interface IAddressSuggestion {
  id: string;
  displayName: string;
  fullAddress: string;
  entrance?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  precision: string;
  kind: string;
  icon: string;
  uri?: string;
  distance?: number;
}




