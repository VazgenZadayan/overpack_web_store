import { create } from 'zustand';
import React from 'react';
import { IToastState } from '@/shared/types/toast';

interface ToastStore extends IToastState {
  showToast: (payload: {
    message: string;
    icon?: React.ReactNode;
    autoHide?: boolean;
    onClose?: () => void;
  }) => void;
  hideToast: () => void;
}

const initialState: Omit<IToastState, 'onClose'> & { onClose?: () => void } = {
  isVisible: false,
  message: 'Something went wrong, please try again',
  icon: null,
  autoHide: true,
  onClose: undefined,
};

export const useToastStore = create<ToastStore>((set) => ({
  ...initialState,
  showToast: (payload) =>
    set({
      isVisible: true,
      message: payload.message,
      icon: payload.icon || null,
      autoHide: payload.autoHide !== undefined ? payload.autoHide : true,
      onClose: payload.onClose,
    }),
  hideToast: () => set(initialState),
}));

