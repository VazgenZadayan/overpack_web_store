import { create } from 'zustand';
import React from 'react';
import { IToastState } from '@/shared/types/toast';

interface ToastStore extends IToastState {
  showToast: (payload: {
    title: string;
    message?: string;
    icon?: React.ReactNode;
    autoHide?: boolean;
    closeBtnText?: string;
    onClose?: () => void;
  }) => void;
  hideToast: () => void;
}

const initialState: Omit<IToastState, 'onClose'> & { onClose?: () => void } = {
  isVisible: false,
  title: 'Unable to Proceed',
  message: 'Something went wrong, please try again',
  icon: null,
  autoHide: true,
  closeBtnText: 'DISMISS',
  onClose: undefined,
};

export const useToastStore = create<ToastStore>((set) => ({
  ...initialState,
  showToast: (payload) =>
    set({
      isVisible: true,
      title: payload.title,
      message: payload.message || '',
      icon: payload.icon || null,
      autoHide: payload.autoHide !== undefined ? payload.autoHide : true,
      closeBtnText: payload.closeBtnText || 'DISMISS',
      onClose: payload.onClose,
    }),
  hideToast: () => set(initialState),
}));

