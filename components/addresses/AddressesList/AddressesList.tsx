'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { getAddresses, deleteAddress, setMainAddress } from '@/lib/api/addresses';
import { IAddress } from '@/shared/types/address';
import { AddressCard } from '../AddressCard/AddressCard';
import { usePathname } from 'next/navigation';
import { useToastStore } from '@/stores/toast';
import Link from 'next/link';
import styles from './AddressesList.module.css';

export const AddressesList: React.FC = () => {
  const t = useTranslations('Address');
  const tCategories = useTranslations('CategoriesPage');
  const tNoAddress = useTranslations('NoAddressesPage');
  const pathname = usePathname();
  const { data, isLoading, mutate } = useSWR('addresses', getAddresses);
  const showToast = useToastStore((state) => state.showToast);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setMainDialogOpen, setSetMainDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const addresses = useMemo(() => data?.data?.addresses || [], [data?.data?.addresses]);
  const isEmpty = !isLoading && addresses.length === 0;

  const lang = pathname.split('/')[1] || 'en';
  const addAddressHref = `/${lang}/profile/addresses/add`;

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/profile/addresses`,
    },
  ];

  const handleDeleteClick = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAddressId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedAddressId) return;
    try {
      await deleteAddress({ id: selectedAddressId });
      setDeleteDialogOpen(false);
      setSelectedAddressId(null);
      mutate();
    } catch {
      showToast({
        message: t('deleteErrorMessage'),
      });
      setDeleteDialogOpen(false);
      setSelectedAddressId(null);
    }
  }, [selectedAddressId, mutate, showToast, t]);

  const handleSetMainClick = useCallback((id: number) => {
    const address = addresses.find((a: IAddress) => a.id === id);
    if (address?.isMain) return;
    setSelectedAddressId(id);
    setSetMainDialogOpen(true);
  }, [addresses]);

  const handleConfirmSetMain = useCallback(async () => {
    if (!selectedAddressId) return;
    try {
      await setMainAddress({ address: selectedAddressId });
      setSetMainDialogOpen(false);
      setSelectedAddressId(null);
      mutate();
    } catch {
      showToast({
        message: t('setMainErrorMessage'),
      });
      setSetMainDialogOpen(false);
      setSelectedAddressId(null);
    }
  }, [selectedAddressId, mutate, showToast, t]);

  if (isEmpty) {
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Breadcrumbs items={breadcrumbsItems} locale={lang} />
          </div>
          <div className={styles.emptyWrapper}>
            <EmptyState
              title={tNoAddress('title')}
              description={tNoAddress('subtitle')}
              lottie="noLocation"
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Link href={addAddressHref} className={styles.footerLink}>
            <Button
              label={t('addAddress')}
              variant="default"
            />
          </Link>
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
          {addresses.map((address: IAddress) => {
            const isOnlyAddress = addresses.length === 1;
            const shouldShowDelete = !address.isMain || isOnlyAddress;
            
            return (
              <AddressCard
                key={address.id}
                address={address}
                onSetMain={() => handleSetMainClick(address.id)}
                onDelete={shouldShowDelete ? (e) => handleDeleteClick(address.id, e) : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <Link href={addAddressHref} className={styles.footerLink}>
          <Button
            label={t('addAddress')}
            variant="default"
          />
        </Link>
      </div>

      <Dialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('deleteConfirmation.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogText}>
            {t('deleteConfirmation.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('deleteConfirmation.okButton')}
              variant="danger"
              onClick={handleConfirmDelete}
            />
            <Button
              label={t('deleteConfirmation.cancelButton')}
              variant="text"
              onClick={() => setDeleteDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={setMainDialogOpen} onClose={() => setSetMainDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" className={styles.dialogTitle}>
            {t('setMainAddress.title')}
          </Typography>
          <Typography variant="bodyMMed" className={styles.dialogText}>
            {t('setMainAddress.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('setMainAddress.okButton')}
              variant="default"
              onClick={handleConfirmSetMain}
            />
            <Button
              label={t('setMainAddress.cancelButton')}
              variant="text"
              onClick={() => setSetMainDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

