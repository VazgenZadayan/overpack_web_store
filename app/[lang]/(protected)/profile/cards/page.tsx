'use client';

import { useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardsList } from '@/components/cards/CardsList/CardsList';
import styles from './cards.module.css';

interface CardsPageProps {
  params: Promise<{ lang: string }>;
}

export default function CardsPage({ params }: CardsPageProps) {
  const { lang } = use(params);
  const searchParams = useSearchParams();
  const cardId = searchParams.get('cardId');
  const paymentID = searchParams.get('paymentID');

  useEffect(() => {
    document.body.classList.add('addresses-page-no-scroll');
    return () => {
      document.body.classList.remove('addresses-page-no-scroll');
    };
  }, []);

  // Если это редирект из окна оплаты, отправляем сообщение родительскому окну
  useEffect(() => {
    if (cardId && paymentID && window.opener) {
      window.opener.postMessage({
        type: 'CARD_ADDED',
        cardId: Number(cardId),
        transactionId: paymentID,
      }, window.location.origin);
      // Закрываем окно после отправки сообщения
      window.close();
    }
  }, [cardId, paymentID]);

  return (
    <div className={styles.container}>
      <CardsList />
    </div>
  );
}

