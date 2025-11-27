import React from 'react';
import { cn } from '@/utils/cn';
import styles from './Checkbox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isChecked: boolean;
  onPress: () => void;
  background?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  onPress,
  background,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        styles.container,
        isChecked ? styles.checkboxChecked : styles.checkbox,
        className
      )}
      style={background && !isChecked ? { backgroundColor: background } : undefined}
      {...props}
    >
      {isChecked && (
        <svg
          className={styles.icon}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      )}
    </button>
  );
};
