'use client';

import React from 'react';
import styles from './FilterInput.module.css';

interface FilterInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      className={styles.input}
    />
  );
};

