import { IBaseSuccessResponse } from './common';

export enum DeliveryStatus {
  NEW = 'new',
  ESTIMATING = 'estimating',
  ESTIMATING_FAILED = 'estimating_failed',
  READY_FOR_APPROVAL = 'ready_for_approval',
  ACCEPTED = 'accepted',
  PERFORMER_LOOKUP = 'performer_lookup',
  PERFORMER_DRAFT = 'performer_draft',
  PERFORMER_FOUND = 'performer_found',
  PERFORMER_NOT_FOUND = 'performer_not_found',
  PICKUP_ARRIVED = 'pickup_arrived',
  READY_FOR_PICKUP_CONFIRMATION = 'ready_for_pickup_confirmation',
  PICKUPED = 'pickuped',
  DELIVERY_ARRIVED = 'delivery_arrived',
  READY_FOR_DELIVERY_CONFIRMATION = 'ready_for_delivery_confirmation',
  DELIVERED = 'delivered',
  DELIVERED_FINISH = 'delivered_finish',
  RETURNING = 'returning',
  RETURN_ARRIVED = 'return_arrived',
  READY_FOR_RETURN_CONFIRMATION = 'ready_for_return_confirmation',
  RETURNED = 'returned',
  RETURNED_FINISH = 'returned_finish',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  CANCELLED_WITH_PAYMENT = 'cancelled_with_payment',
  CANCELLED_BY_TAXI = 'cancelled_by_taxi',
  CANCELLED_WITH_ITEMS_ON_HANDS = 'cancelled_with_items_on_hands',
}

export type TransportType =
  | 'bicycle'
  | 'car'
  | 'courier_car'
  | 'courier_moto'
  | 'electric_bicycle'
  | 'motorcycle'
  | 'pedestrian'
  | 'rickshaw'
  | 'rover';

export interface ICourierInfo {
  courier_name: string;
  legal_name: string;
  car_model: string;
  car_number: string;
  car_color: string;
  car_color_hex: string;
  transport_type: TransportType;
}

export interface IOrderHistoryItem {
  orderId: number;
  deliveryStatus: DeliveryStatus;
  totalPrice: number;
  addressId: number;
  address: string;
  createdAt: string;
  courierInfo: ICourierInfo | null;
}

export interface IOrderHistoryData {
  orders: IOrderHistoryItem[];
}

export interface IOrderHistoryResponse extends IBaseSuccessResponse {
  data: IOrderHistoryData;
}

export interface IOrderHistoryRequest {
  limit: number;
  page: number;
}

