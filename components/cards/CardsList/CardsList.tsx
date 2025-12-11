'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { getCards, deleteCard, setMainCard, addCard, verifyCard } from '@/lib/api/cards';
import { ICard } from '@/shared/types/card';
import { CardCard } from '../CardCard/CardCard';
import { usePathname } from 'next/navigation';
import { useToastStore } from '@/stores/toast';
import { FilterInput } from '@/shared/ui/FilterInput/FilterInput';
import styles from './CardsList.module.css';

export const CardsList: React.FC = () => {
  const t = useTranslations('paymentCards');
  const tCategories = useTranslations('CategoriesPage');
  const tEmptyCards = useTranslations('paymentCards.emptyCards');
  const pathname = usePathname();
  const { data, isLoading, mutate } = useSWR('cards', getCards);
  const showToast = useToastStore((state) => state.showToast);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setMainDialogOpen, setSetMainDialogOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [showCardNameModal, setShowCardNameModal] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [isVerifyingCard, setIsVerifyingCard] = useState(false);

  const cards = useMemo(() => data?.data?.cards || [], [data?.data?.cards]);
  const isEmpty = !isLoading && cards.length === 0;

  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CARD_ADDED' && event.data?.cardId && event.data?.transactionId) {
        setPendingCardId(event.data.cardId);
        setPendingTransactionId(event.data.transactionId);
        setShowCardNameModal(true);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/profile/cards`,
    },
  ];

  const handleDeleteClick = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCardId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedCardId) return;
    try {
      await deleteCard({ cardId: selectedCardId });
      setDeleteDialogOpen(false);
      setSelectedCardId(null);
      mutate();
    } catch {
      showToast({
        message: t('deleteCard.errorMessage'),
      });
      setDeleteDialogOpen(false);
      setSelectedCardId(null);
    }
  }, [selectedCardId, mutate, showToast, t]);

  const handleSetMainClick = useCallback((id: number) => {
    const card = cards.find((c: ICard) => c.id === id);
    if (card?.isMain) return;
    setSelectedCardId(id);
    setSetMainDialogOpen(true);
  }, [cards]);

  const handleConfirmSetMain = useCallback(async () => {
    if (!selectedCardId) return;
    try {
      await setMainCard({ cardId: selectedCardId });
      setSetMainDialogOpen(false);
      setSelectedCardId(null);
      mutate();
    } catch {
      showToast({
        message: t('setMainCard.errorMessage'),
      });
      setSetMainDialogOpen(false);
      setSelectedCardId(null);
    }
  }, [selectedCardId, mutate, showToast, t]);

  const handleAddCard = useCallback(async () => {
    setIsAddingCard(true);
    try {
      const response = await addCard(lang);
      if (response?.data?.redirectionURL) {
        window.open(response.data.redirectionURL, '_blank');
        setIsAddingCard(false);
      } else {
        throw new Error('No redirection URL received');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      showToast({
        message: error instanceof Error ? error.message : t('addCard.errorMessage'),
      });
      setIsAddingCard(false);
    }
  }, [showToast, t, lang]);

  const handleVerifyCard = useCallback(async () => {
    if (!pendingCardId || !pendingTransactionId || !cardTitle.trim()) {
      return;
    }

    setIsVerifyingCard(true);
    try {
      await verifyCard({
        cardId: pendingCardId,
        transactionId: pendingTransactionId,
        cardTitle: cardTitle.trim(),
      });
      setShowCardNameModal(false);
      setCardTitle('');
      setPendingCardId(null);
      setPendingTransactionId(null);
      mutate();
      showToast({
        message: t('addCard.success'),
      });
    } catch (error) {
      console.error('Error verifying card:', error);
      showToast({
        message: t('addCard.errorMessage'),
      });
      setShowCardNameModal(false);
      setCardTitle('');
      setPendingCardId(null);
      setPendingTransactionId(null);
    } finally {
      setIsVerifyingCard(false);
    }
  }, [pendingCardId, pendingTransactionId, cardTitle, mutate, showToast, t]);

  if (isEmpty) {
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Breadcrumbs items={breadcrumbsItems} locale={lang} />
          </div>
          <div className={styles.emptyWrapper}>
            <EmptyState
              title={tEmptyCards('title')}
              description={tEmptyCards('subtitle')}
              lottie="creditCards"
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            label={t('addCard.button')}
            variant="default"
            onClick={handleAddCard}
            isLoading={isAddingCard}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Breadcrumbs items={breadcrumbsItems} locale={lang} />
        </div>

        <div className={styles.list}>
          {cards.map((card: ICard) => {
            const isOnlyCard = cards.length === 1;
            const shouldShowDelete = !card.isMain || isOnlyCard;
            
            return (
              <CardCard
                key={card.id}
                card={card}
                onSetMain={() => handleSetMainClick(card.id)}
                onDelete={shouldShowDelete ? (e) => handleDeleteClick(card.id, e) : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          label={t('addCard.button')}
          variant="default"
          onClick={handleAddCard}
          isLoading={isAddingCard}
        />
      </div>

      <Dialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('deleteCard.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogText}>
            {t('deleteCard.confirmation')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('deleteCard.confirm')}
              variant="danger"
              onClick={handleConfirmDelete}
            />
            <Button
              label={t('deleteCard.cancel')}
              variant="text"
              onClick={() => setDeleteDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={setMainDialogOpen} onClose={() => setSetMainDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('setMainCard.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogText}>
            {t('setMainCard.confirmation')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('setMainCard.confirm')}
              variant="default"
              onClick={handleConfirmSetMain}
            />
            <Button
              label={t('setMainCard.cancel')}
              variant="text"
              onClick={() => setSetMainDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={showCardNameModal} onClose={() => {
        setShowCardNameModal(false);
        setCardTitle('');
        setPendingCardId(null);
        setPendingTransactionId(null);
      }}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('addCard.cardNameModal.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogText}>
            {t('addCard.cardNameModal.subtitle')}
          </Typography>
          <FilterInput
            value={cardTitle}
            onChangeText={setCardTitle}
            placeholder={t('addCard.cardNameModal.placeholder')}
          />
          <div className={styles.dialogButtons}>
            <Button
              label={t('addCard.cardNameModal.button')}
              variant="default"
              onClick={handleVerifyCard}
              isLoading={isVerifyingCard}
            />
            <Button
              label={t('setMainCard.cancel')}
              variant="text"
              onClick={() => {
                setShowCardNameModal(false);
                setCardTitle('');
                setPendingCardId(null);
                setPendingTransactionId(null);
              }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

