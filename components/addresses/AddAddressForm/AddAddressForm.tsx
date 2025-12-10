'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { FilterInput } from '@/shared/ui/FilterInput/FilterInput';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs';
import { geocoderService } from '@/lib/services/geocoder';
import { addAddress } from '@/lib/api/addresses';
import { IAddressSuggestion } from '@/shared/types/address';
import styles from './AddAddressForm.module.css';

export const AddAddressForm: React.FC = () => {
  const t = useTranslations('Address');
  const tCategories = useTranslations('CategoriesPage');
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  const breadcrumbsItems = [
    {
      label: tCategories('title'),
      href: `/${lang}/categories`,
    },
    {
      label: t('title'),
      href: `/${lang}/profile/addresses`,
    },
    {
      label: t('newAddress'),
      href: `/${lang}/profile/addresses/add`,
    },
  ];
  const [addressText, setAddressText] = useState('');
  const [suggestions, setSuggestions] = useState<IAddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<IAddressSuggestion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEntranceDisabled, setIsEntranceDisabled] = useState(false);
  
  const [entrance, setEntrance] = useState('');
  const [apartment, setApartment] = useState('');
  const [floor, setFloor] = useState('');
  const [intercom, setIntercom] = useState('');
  const [other, setOther] = useState('');

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const results = await geocoderService.searchAddress(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching addresses:', error);
      setSuggestions([]);
    }
  }, []);

  const handleAddressTextChange = useCallback((text: string) => {
    setAddressText(text);
    if (selectedAddress && text !== formatSelectedAddress(selectedAddress)) {
      setSelectedAddress(null);
    }

    if (!text) {
      setSelectedAddress(null);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsEntranceDisabled(false);
      setEntrance('');
      setApartment('');
      setFloor('');
      setIntercom('');
      setOther('');
    } else {
      setTimeout(() => {
        searchAddresses(text);
      }, 200);
    }
  }, [selectedAddress, searchAddresses]);

  const formatSelectedAddress = (address: IAddressSuggestion): string => {
    return `${address.displayName}, ${address.fullAddress}`;
  };

  const handleAddressSelect = useCallback(async (address: IAddressSuggestion) => {
    if (address.uri) {
      try {
        const coordinates = await geocoderService.getCoordinates(address.uri);
        if (coordinates) {
          const addressWithCoords = {
            ...address,
            coordinates,
          };
          setSelectedAddress(addressWithCoords);
        } else {
          setSelectedAddress(address);
        }
      } catch {
        setSelectedAddress(address);
      }
    } else {
      setSelectedAddress(address);
    }

    const formattedAddress = formatSelectedAddress(address);
    setAddressText(formattedAddress);
    setShowSuggestions(false);

    if (address.entrance) {
      setEntrance(address.entrance);
      setIsEntranceDisabled(true);
    } else {
      setEntrance('');
      setIsEntranceDisabled(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedAddress) {
      return;
    }

    if (
      !selectedAddress.coordinates ||
      selectedAddress.coordinates.latitude === 0 ||
      selectedAddress.coordinates.longitude === 0
    ) {
      alert(t('CoordinatesErrorMessage'));
      return;
    }

    const formattedAddress = formatSelectedAddress(selectedAddress);

    setIsSubmitting(true);
    try {
      await addAddress({
        address: formattedAddress,
        entrance: Number(entrance) || 0,
        apartment: Number(apartment) || 0,
        floor: Number(floor) || 0,
        intercom: intercom || '',
        other: other || '',
        latitude: selectedAddress.coordinates.latitude,
        longitude: selectedAddress.coordinates.longitude,
      });
      const lang = pathname.split('/')[1] || 'en';
      router.push(`/${lang}/profile/addresses`);
    } catch (error) {
      console.error('Error adding address:', error);
      alert(t('AddErrorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAddress, entrance, apartment, floor, intercom, other, t, router, pathname]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Breadcrumbs items={breadcrumbsItems} locale={lang} />
        </div>

        <div className={styles.content}>
          <div className={styles.searchSection}>
            <FilterInput
              placeholder={t('form.deliveryQuestion')}
              value={addressText}
              onChangeText={handleAddressTextChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {!selectedAddress ? (
            showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestionsContainer}>
                <div className={styles.suggestionsList}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => handleAddressSelect(suggestion)}
                    >
                      <MapPin size={20} color="var(--color-main)" className={styles.suggestionIcon} />
                      <div className={styles.suggestionText}>
                        <Typography variant="bodyMSB" className={styles.suggestionTitle}>
                          {suggestion.displayName}
                        </Typography>
                        <Typography variant="bodyMSB" className={styles.suggestionSubtitle}>
                          {suggestion.fullAddress}
                        </Typography>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className={styles.detailsSection}>
              <Typography variant="bodyMSB" className={styles.detailsTitle}>
                {t('form.additionalDetails')}
              </Typography>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t('form.entrance')}
                    value={entrance}
                    onChange={(e) => setEntrance(e.target.value)}
                    disabled={isEntranceDisabled}
                    className={styles.input}
                  />
                </div>
                <div className={styles.detailItem}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t('form.apartment')}
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t('form.floor')}
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.detailItem}>
                  <input
                    type="text"
                    placeholder={t('form.intercom')}
                    value={intercom}
                    onChange={(e) => setIntercom(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder={t('form.other')}
                value={other}
                onChange={(e) => setOther(e.target.value)}
                className={styles.input}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          label={t('saveAddress')}
          variant="default"
          onClick={handleSubmit}
          isDisabled={!selectedAddress || isSubmitting}
          isLoading={isSubmitting}
        />
      </div>
    </>
  );
};

