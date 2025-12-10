'use client';

import React, { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { Clock, MapPin } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { PartnerGallery } from '../PartnerGallery/PartnerGallery';
import { getPartners } from '@/lib/api/partners';
import { extractIdFromSlug } from '@/utils/slug';
import styles from './PartnerDetail.module.css';

export const PartnerDetail: React.FC = () => {
  const t = useTranslations('Partners');
  const tCategories = useTranslations('CategoriesPage');
  const params = useParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const slug = (params?.slug as string) || '';
  const lang = pathname.split('/')[1] || 'en';
  const partnerId = useMemo(() => {
    if (!slug) return null;
    return extractIdFromSlug(slug);
  }, [slug]);

  const { data } = useSWR('partners', getPartners);
  const partner = useMemo(() => {
    if (!data?.data?.partners || !partnerId) return null;
    return data.data.partners.find((p) => p.id === partnerId);
  }, [data, partnerId]);

  const breadcrumbsItems = useMemo(() => [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/profile/partners`,
    },
    {
      label: partner?.name || '',
      href: slug ? `/${lang}/profile/partners/${slug}` : `/${lang}/profile/partners`,
    },
  ], [tCategories, t, lang, partner?.name, slug]);

  const handleReserve = async () => {
    if (!partner?.phone) return;
    setIsLoading(true);
    try {
      window.location.href = `tel:${partner.phone}`;
    } catch (error) {
      console.error('Error opening phone:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://yandex.ru/maps/?text=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const images = useMemo(() => {
    if (!partner?.images) return [];
    try {
      const parsed = JSON.parse(partner.images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [partner?.images]);

  if (!slug || !partnerId) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Breadcrumbs items={breadcrumbsItems} locale={lang} />
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Breadcrumbs items={breadcrumbsItems} locale={lang} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbsItems} locale={lang} />
      </div>

      <div className={styles.content}>
        {images.length > 0 && (
          <PartnerGallery images={images} partnerName={partner.name} />
        )}

        <div className={styles.workingHoursRow}>
          <Clock size={20} className={styles.icon} />
          <Typography variant="bodyMMed">
            {t('workingHours')}: {partner.workingHours}
          </Typography>
        </div>

        <div className={styles.infoBlock}>
          <Typography variant="h3" className={styles.infoTitle}>
            {t('addresses')}
          </Typography>
          <button
            onClick={() => handleOpenMaps(partner.address)}
            className={styles.addressRow}
          >
            <MapPin size={20} className={styles.icon} />
            <Typography variant="bodyMMed" className={styles.addressText}>
              {partner.address}
            </Typography>
          </button>
        </div>

        {partner.description && (
          <div className={styles.descriptionWrapper}>
            <div className={styles.descriptionBlock}>
              <Typography variant="h3" className={styles.descriptionTitle}>
                {t('description')}
              </Typography>
              <Typography variant="bodySMed" className={styles.descriptionText}>
                {partner.description}
              </Typography>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          label={t('reserveTable')}
          variant="default"
          onClick={handleReserve}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

