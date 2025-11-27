export interface IConfirmDialogState {
  isDialogVisible: boolean;
  title: string;
  helpText: string;
  okButtonText: string;
  cancelButtonText: string;
  showCloseButton: boolean;
  onOk: () => void;
  onCancel: () => void;
}

