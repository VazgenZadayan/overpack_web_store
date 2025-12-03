'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './OTPInput.module.css';

interface OTPInputProps {
  length?: number;
  onFilled?: (code: string) => void;
  onInputChange?: (values: string[]) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  hasError?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onFilled,
  onInputChange,
  autoFocus = false,
  disabled = false,
  hasError = false,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');
    if (digit.length > 1) return;

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    // Notify parent about input change
    if (onInputChange) {
      onInputChange(newValues);
    }

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all filled
    const code = newValues.join('');
    if (code.length === length && onFilled) {
      onFilled(code);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    const newValues = [...values];
    
    for (let i = 0; i < pastedData.length && i < length; i++) {
      newValues[i] = pastedData[i];
    }
    
    setValues(newValues);
    
    // Notify parent about input change
    if (onInputChange) {
      onInputChange(newValues);
    }
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    
    // Check if all filled
    const code = newValues.join('');
    if (code.length === length && onFilled) {
      onFilled(code);
    }
  };

  return (
    <div className={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          style={{
            color: hasError ? 'var(--color-main)' : 'var(--color-dark)',
            borderColor: 'var(--color-gray)',
            borderWidth: focusedIndex === index ? 0 : '1px',
            boxShadow: focusedIndex === index ? '0 0 0 3px rgba(var(--color-main-rgb, 240, 77, 82), 0.1)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

