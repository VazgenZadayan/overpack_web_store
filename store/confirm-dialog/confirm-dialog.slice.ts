import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { noop } from '@/utils/helpers';

import { IConfirmDialogState } from './types';

const initialState: IConfirmDialogState = {
  isDialogVisible: false,
  title: '',
  helpText: '',
  okButtonText: '',
  cancelButtonText: '',
  showCloseButton: false,
  onOk: noop,
  onCancel: noop,
};

const confirmDialog = createSlice({
  name: 'confirmDialog',
  initialState,
  reducers: {
    openDialog(
      state,
      action: PayloadAction<{
        title: string;
        helpText: string;
        okButtonText: string;
        cancelButtonText?: string;
        showCloseButton?: boolean;
        onOk: () => void;
        onCancel?: () => void;
      }>,
    ) {
      state.isDialogVisible = true;
      state.title = action.payload.title;
      state.helpText = action.payload.helpText;
      state.okButtonText = action.payload.okButtonText;
      state.cancelButtonText = action.payload.cancelButtonText;
      state.showCloseButton = action.payload.showCloseButton;
      state.onOk = action.payload.onOk;
      state.onCancel = action.payload.onCancel;
    },
    closeDialog(state) {
      state.isDialogVisible = false;
      state.title = initialState.title;
      state.helpText = initialState.helpText;
      state.okButtonText = initialState.okButtonText;
      state.cancelButtonText = initialState.cancelButtonText;
      state.showCloseButton = initialState.showCloseButton;
      state.onOk = initialState.onOk;
      state.onCancel = initialState.onCancel;
    },
  },
});

export const { openDialog, closeDialog } = confirmDialog.actions;
export const confirmDialogReducer = confirmDialog.reducer;

