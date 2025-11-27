import React from 'react';

export interface IToastState {
  isVisible: boolean;
  title: string;
  message: string;
  icon: React.ReactNode | null;
  autoHide: boolean;
  closeBtnText: string;
  onClose?: () => void;
}



