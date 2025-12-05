export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userPhone?: string;
  documentNumber?: string;
  locale: string;
}

