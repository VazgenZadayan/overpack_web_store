'use client';

import React from 'react';
import styles from './FilterInput.module.css';

interface FilterInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onKeyDown,
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <div className={`${styles.container} ${value ? styles.hasValue : ''}`}>
      <div className={styles.iconLeft}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19L14.65 14.65"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        onKeyDown={onKeyDown}
        className={styles.input}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

