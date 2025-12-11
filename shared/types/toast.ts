import React from 'react';

export interface IToastState {
  isVisible: boolean;
  message: string;
  icon: React.ReactNode | null;
  autoHide: boolean;
  onClose?: () => void;
}

