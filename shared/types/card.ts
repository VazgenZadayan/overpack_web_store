import { IBaseSuccessResponse } from './common';

export interface ICard {
  id: number;
  userId: number;
  isMain: number;
  title: string;
}

export interface IGetCardsResponse extends IBaseSuccessResponse {
  data: {
    cards: ICard[];
  };
}

export interface IAddCardResponse extends IBaseSuccessResponse {
  data: {
    redirectionURL: string;
  };
}

export interface IVerifyCardRequest {
  cardId: number;
  transactionId: string;
  cardTitle: string;
}

export interface IVerifyCardResponse extends IBaseSuccessResponse {
  data: {
    cardId: number;
    transactionId: string;
    cardTitle: string;
  };
}

export interface ISetMainCardRequest {
  cardId: number;
}

export interface ISetMainCardResponse extends IBaseSuccessResponse {
  data: {
    cardId: number;
  };
}

export interface IDeleteCardRequest {
  cardId: number;
}

export interface IDeleteCardResponse extends IBaseSuccessResponse {
  data: {
    cardId: number;
  };
}

