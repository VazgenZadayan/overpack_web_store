export interface ThemeColors {
  MAIN: string;
  SECONDARY: string;
  BACKGROUND: string;
  GRAY: string;
  WHITE: string;
  WHITE_CONSTANT: string;
  ICON_COLOR: string;
  DARK: string;
  SECONDARY_TEXT: string;
  BLACK: string;
  TRANSPARENT: string;
  MODAL_OVERLAY: string;
}

export const lightThemeColors: ThemeColors = {
  MAIN: '#F03341',
  SECONDARY: '#FDEBEC',
  BACKGROUND: '#EFEFEF',
  GRAY: '#F3F4F6',
  WHITE: '#FFFFFF',
  WHITE_CONSTANT: '#FFFFFF',
  ICON_COLOR: '#9D9FAB',
  DARK: '#191C30',
  SECONDARY_TEXT: '#6B6D80',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.5)',
};

export const darkThemeColors: ThemeColors = {
  MAIN: '#F03341',
  SECONDARY: '#3A1517',
  BACKGROUND: '#141414',
  GRAY: '#26282B',
  WHITE: '#191C1D',
  WHITE_CONSTANT: '#FFFFFF',
  ICON_COLOR: '#9D9FAB',
  DARK: '#FAFAFA',
  SECONDARY_TEXT: '#CCCCCC',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.5)',
};

export type ThemeColorsType = ThemeColors;

