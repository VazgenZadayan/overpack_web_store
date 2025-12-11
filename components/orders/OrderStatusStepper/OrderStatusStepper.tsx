'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Package, Truck, Check } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { DeliveryStatus } from '@/shared/types/order';
import styles from './OrderStatusStepper.module.css';

interface OrderStatusStepperProps {
  deliveryStatus: DeliveryStatus | null;
}

const ORDER_STATUS_FLOW = {
  courier_searching: ['courier_searching', 'preparing', 'courier_delivering', 'delivered'],
  preparing: ['preparing', 'courier_delivering', 'delivered'],
  courier_delivering: ['courier_delivering', 'delivered'],
  delivered: ['delivered'],
};

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({
  deliveryStatus,
}) => {
  const t = useTranslations('Order.history.status');

  const currentStatus = useMemo(() => {
    if (!deliveryStatus) return 'preparing';

    switch (deliveryStatus) {
      case DeliveryStatus.PERFORMER_LOOKUP:
      case DeliveryStatus.PERFORMER_DRAFT:
        return 'courier_searching';
      case DeliveryStatus.PERFORMER_FOUND:
      case DeliveryStatus.PICKUP_ARRIVED:
      case DeliveryStatus.READY_FOR_PICKUP_CONFIRMATION:
        return 'preparing';
      case DeliveryStatus.PICKUPED:
        return 'courier_delivering';
      case DeliveryStatus.DELIVERED:
      case DeliveryStatus.DELIVERY_ARRIVED:
      case DeliveryStatus.READY_FOR_DELIVERY_CONFIRMATION:
        return 'delivered';
      default:
        return 'courier_searching';
    }
  }, [deliveryStatus]);

  const stepStates = useMemo(
    () => ({
      isCourierSearchingCompleted:
        ORDER_STATUS_FLOW.courier_searching.includes(currentStatus),
      isCourierSearchingCurrent: currentStatus === 'courier_searching',
      isPreparingCompleted: ORDER_STATUS_FLOW.preparing.includes(currentStatus),
      isPreparingCurrent: currentStatus === 'preparing',
      isCourierDeliveringCompleted:
        ORDER_STATUS_FLOW.courier_delivering.includes(currentStatus),
      isCourierDeliveringCurrent: currentStatus === 'courier_delivering',
      isDeliveredCurrent: currentStatus === 'delivered',
    }),
    [currentStatus],
  );

  const getCircleColor = (isCompleted: boolean, isCurrent: boolean): string => {
    if (isCompleted || isCurrent) return 'var(--color-main)';
    return '#6B7280';
  };

  const getTextColor = (isCompleted: boolean, isCurrent: boolean): string => {
    if (isCompleted || isCurrent) return 'var(--color-main)';
    return 'var(--color-secondary-text)';
  };

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepsRow}>
        <div className={styles.stepWrapper}>
          <div
            className={styles.stepCircle}
            style={{
              backgroundColor: getCircleColor(
                stepStates.isCourierSearchingCompleted,
                stepStates.isCourierSearchingCurrent,
              ),
            }}
          >
            <Search size={16} color="var(--color-white-constant)" />
          </div>
          <Typography
            variant="bodyXSSB"
            className={styles.stepLabel}
            style={{
              color: getTextColor(
                stepStates.isCourierSearchingCompleted,
                stepStates.isCourierSearchingCurrent,
              ),
            }}
          >
            {t('courierSearching')}
          </Typography>
          <div className={styles.dotSeparator} />
        </div>

        <div className={styles.stepWrapper}>
          <div
            className={styles.stepCircle}
            style={{
              backgroundColor: getCircleColor(
                stepStates.isPreparingCompleted,
                stepStates.isPreparingCurrent,
              ),
            }}
          >
            <Package size={16} color="var(--color-white-constant)" />
          </div>
          <Typography
            variant="bodyXSSB"
            className={styles.stepLabel}
            style={{
              color: getTextColor(
                stepStates.isPreparingCompleted,
                stepStates.isPreparingCurrent,
              ),
            }}
          >
            {t('preparing')}
          </Typography>
          <div className={styles.dotSeparator} />
        </div>

        <div className={styles.stepWrapper}>
          <div
            className={styles.stepCircle}
            style={{
              backgroundColor: getCircleColor(
                stepStates.isCourierDeliveringCompleted,
                stepStates.isCourierDeliveringCurrent,
              ),
            }}
          >
            <Truck size={16} color="var(--color-white-constant)" />
          </div>
          <Typography
            variant="bodyXSSB"
            className={styles.stepLabel}
            style={{
              color: getTextColor(
                stepStates.isCourierDeliveringCompleted,
                stepStates.isCourierDeliveringCurrent,
              ),
            }}
          >
            {t('courierDelivering')}
          </Typography>
          <div className={styles.dotSeparator} />
        </div>

        <div className={styles.stepWrapper}>
          <div
            className={styles.stepCircle}
            style={{
              backgroundColor: getCircleColor(false, stepStates.isDeliveredCurrent),
            }}
          >
            <Check size={16} color="var(--color-white-constant)" />
          </div>
          <Typography
            variant="bodyXSSB"
            className={styles.stepLabel}
            style={{
              color: getTextColor(false, stepStates.isDeliveredCurrent),
            }}
          >
            {t('delivered')}
          </Typography>
        </div>
      </div>
    </div>
  );
};

