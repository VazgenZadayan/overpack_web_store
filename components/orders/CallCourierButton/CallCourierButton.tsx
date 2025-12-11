'use client';

import React, { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { getCourierPhone } from '@/lib/api/delivery';
import { DeliveryStatus } from '@/shared/types/order';
import { useToastStore } from '@/stores/toast';
import styles from './CallCourierButton.module.css';

interface CallCourierButtonProps {
  orderId: number;
  deliveryStatus: DeliveryStatus;
}

const allowedDeliveryStatuses = [
  DeliveryStatus.PERFORMER_FOUND,
  DeliveryStatus.PICKUP_ARRIVED,
  DeliveryStatus.READY_FOR_PICKUP_CONFIRMATION,
  DeliveryStatus.PICKUPED,
  DeliveryStatus.DELIVERY_ARRIVED,
  DeliveryStatus.READY_FOR_DELIVERY_CONFIRMATION,
];

export const CallCourierButton: React.FC<CallCourierButtonProps> = ({
  orderId,
  deliveryStatus,
}) => {
  const t = useTranslations('Order.history');
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLoading(true);
      try {
        const result = await getCourierPhone({ orderId });
        if (result?.data?.phone) {
          const phoneNumber = `${result.data.phone},,${result.data.ext || ''}`;
          window.location.href = `tel:${phoneNumber}`;
        }
      } catch {
        showToast({
          message: t('callCourierError'),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [orderId, showToast, t],
  );

  if (!allowedDeliveryStatuses.includes(deliveryStatus)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={styles.button}
    >
      {isLoading ? (
        <svg
          className={styles.loadingSpinner}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          <Phone size={20} />
          <span>{t('callCourier')}</span>
        </>
      )}
    </button>
  );
};

