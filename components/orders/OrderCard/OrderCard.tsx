'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { OrderStatusStepper } from '../OrderStatusStepper/OrderStatusStepper';
import { CallCourierButton } from '../CallCourierButton/CallCourierButton';
import { IOrderHistoryItem, DeliveryStatus } from '@/shared/types/order';
import { formatPrice } from '@/utils/helpers';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: IOrderHistoryItem;
  locale: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, locale }) => {
  const router = useRouter();
  const t = useTranslations('Order.history');

  const isActiveOrder = useCallback(
    (deliveryStatus: DeliveryStatus | null): boolean => {
      return deliveryStatus !== DeliveryStatus.DELIVERED_FINISH;
    },
    [],
  );

  const formatDate = useCallback((dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ru-RU');
    const formattedTime = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: formattedDate, time: formattedTime };
  }, []);

  const isActive = isActiveOrder(order.deliveryStatus);
  const { date: orderDate, time: orderTime } = formatDate(order.createdAt);

  const handleClick = () => {
    router.push(`/${locale}/profile/history/${order.orderId}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardTopContainer}>
        <Typography variant="bodyLBold" className={styles.orderNumber}>
          {t('orderNumber', { number: order.orderId })}
        </Typography>
        <Typography variant="bodyMBold" className={styles.price}>
          {formatPrice(order.totalPrice)} ֏
        </Typography>
      </div>

      <div className={styles.locationWrapper}>
        <MapPin size={20} className={styles.icon} />
        <Typography variant="bodyMMed" className={styles.address}>
          {order.address}
        </Typography>
      </div>

      <div className={styles.locationWrapper}>
        <Calendar size={20} className={styles.icon} />
        <Typography variant="bodyMSB" className={styles.dateTime}>
          {orderDate} {orderTime}
        </Typography>
      </div>

      {isActive && (
        <>
          <OrderStatusStepper deliveryStatus={order.deliveryStatus} />
          <CallCourierButton
            orderId={order.orderId}
            deliveryStatus={order.deliveryStatus}
          />
        </>
      )}
    </div>
  );
};

