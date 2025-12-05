'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, MapPin, CreditCard, ShoppingBag, Users, Info, LogOut, User } from 'lucide-react';
import { getInitials } from '@/utils/helpers';
import { removeAuthToken } from '@/utils/auth';
import { deleteUser } from '@/lib/api/user';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import { SidebarProps } from './types';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userName,
  userPhone,
  documentNumber,
  locale,
}) => {
  const t = useTranslations('Profile');
  const router = useRouter();
  const initials = userName ? getInitials(userName) : null;
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await removeAuthToken();
      setIsLogoutDialogOpen(false);
      onClose();
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccountClick = () => {
    setIsDeleteAccountDialogOpen(true);
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteUser();
      await removeAuthToken();
      setIsDeleteAccountDialogOpen(false);
      setIsDeleting(false);
      onClose();
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeleting(false);
    }
  };

  const menuItems = [
    { icon: MapPin, label: t('tabs.addresses'), href: `/${locale}/profile/addresses` },
    { icon: CreditCard, label: t('tabs.cards'), href: `/${locale}/profile/cards` },
    { icon: ShoppingBag, label: t('tabs.history'), href: `/${locale}/profile/history` },
    { icon: Users, label: t('tabs.partnersTitle'), href: `/${locale}/profile/partners` },
    { icon: Info, label: t('tabs.aboutUs'), href: `/${locale}/about` },
  ];

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.content}>
          <div className={styles.userInfo}>
            <div className={styles.userInfoLeft}>
              <div className={styles.avatar}>
                {initials ? (
                  <span className={styles.initials}>{initials}</span>
                ) : (
                  <User size={24} color="var(--color-white-constant)" />
                )}
              </div>
              <div className={styles.userDetails}>
                {userName && (
                  <h2 className={styles.userName}>{userName}</h2>
                )}
                {documentNumber && (
                  <div className={styles.documentNumber}>
                    <span className={styles.documentLabel}>{t('inn')}:</span>
                    <span className={styles.documentValue}>{documentNumber}</span>
                  </div>
                )}
                {userPhone && (
                  <p className={styles.userPhone}>+{userPhone}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className={styles.menu}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={styles.menuItem}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    router.push(item.href);
                  }}
                >
                  <Icon size={26} className={styles.menuIcon} />
                  <span className={styles.menuLabel}>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className={styles.footer}>
            <button
              onClick={handleLogoutClick}
              className={styles.logoutButton}
            >
              <LogOut size={20} className={styles.buttonIcon} />
              <span>{t('logoutButton')}</span>
            </button>
            <button
              onClick={handleDeleteAccountClick}
              className={styles.deleteButton}
            >
              {t('deleteAccountButton')}
            </button>
          </div>
        </div>
      </div>

      <Dialog isOpen={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" textAlign="center" className={styles.dialogTitle}>
            {t('logout.title')}
          </Typography>
          <Typography variant="bodyMMed" textAlign="center" className={styles.dialogText}>
            {t('logout.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('logout.okButton')}
              variant="danger"
              onClick={handleLogoutConfirm}
            />
            <Button
              label={t('logout.cancelButton')}
              variant="text"
              onClick={() => setIsLogoutDialogOpen(false)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={isDeleteAccountDialogOpen} onClose={() => setIsDeleteAccountDialogOpen(false)}>
        <div className={styles.dialogContent}>
          <Typography variant="h3" textAlign="center" className={styles.dialogTitle}>
            {t('deleteAccount.title')}
          </Typography>
          <Typography variant="bodyMMed" textAlign="center" className={styles.dialogText}>
            {t('deleteAccount.helpText')}
          </Typography>
          <div className={styles.dialogButtons}>
            <Button
              label={t('deleteAccount.okButton')}
              variant="danger"
              onClick={handleDeleteAccountConfirm}
              isLoading={isDeleting}
              isDisabled={isDeleting}
            />
            <Button
              label={t('deleteAccount.cancelButton')}
              variant="text"
              onClick={() => setIsDeleteAccountDialogOpen(false)}
              isDisabled={isDeleting}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

