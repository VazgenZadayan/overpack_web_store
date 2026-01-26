'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const useGuestModeModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const handleLogin = () => {
    hideModal();
    const lang = pathname.split('/')[1] || 'en';
    router.push(`/${lang}/login`);
  };

  const handleContinueAsGuest = () => {
    hideModal();
  };

  return {
    isVisible,
    showModal,
    hideModal,
    handleLogin,
    handleContinueAsGuest,
  };
};



