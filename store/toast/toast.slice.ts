import React from 'react';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IToastState } from './types';

const initialState: IToastState = {
  isVisible: false,
  title: 'Unable to Proceed',
  message: 'Something went wrong, please try again',
  icon: null,
  autoHide: true,
  closeBtnText: 'DISMISS',
  onClose: undefined,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(
      state,
      action: PayloadAction<{
        title: string;
        message?: string;
        icon?: React.ReactNode;
        autoHide?: boolean;
        closeBtnText?: string;
        onClose?: () => void;
      }>,
    ) {
      state.isVisible = true;
      state.title = action.payload.title;
      state.message = action.payload.message || '';
      state.icon = action.payload.icon || null;
      if (action.payload.autoHide !== undefined) {
        state.autoHide = action.payload.autoHide;
      }
      if (action.payload.closeBtnText) {
        state.closeBtnText = action.payload.closeBtnText;
      }
      if (action.payload.onClose) {
        state.onClose = action.payload.onClose;
      }
    },
    hideToast(state) {
      state.isVisible = false;
      state.title = initialState.title;
      state.message = initialState.message;
      state.icon = initialState.icon;
      state.autoHide = initialState.autoHide;
      state.closeBtnText = initialState.closeBtnText;
      state.onClose = initialState.onClose;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;



