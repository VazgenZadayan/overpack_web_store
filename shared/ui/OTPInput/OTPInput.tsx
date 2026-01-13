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
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/[^0-9]/g, '').slice(0, length);
    if (code.length === length) {
      const newValues = code.split('');
      setValues(newValues);
      
      if (onInputChange) {
        onInputChange(newValues);
      }
      
      inputRefs.current[length - 1]?.focus();
      
      if (onFilled) {
        onFilled(code);
      }
      
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = '';
      }
    }
  };

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    if (disabled || index !== 0) return;
    
    const target = e.currentTarget;
    const inputValue = target.value;
    const digits = inputValue.replace(/[^0-9]/g, '');
    
    if (digits.length > 1) {
      const newValues = [...values];
      
      for (let i = 0; i < digits.length && i < length; i++) {
        newValues[i] = digits[i];
      }
      
      setValues(newValues);
      
      if (onInputChange) {
        onInputChange(newValues);
      }
      
      const nextIndex = Math.min(digits.length, length - 1);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);
      
      const code = newValues.join('');
      if (code.length === length && onFilled) {
        setTimeout(() => {
          onFilled(code);
        }, 0);
      }
    }
  };

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    
    const digits = value.replace(/[^0-9]/g, '');
    
    if (digits.length === 1 || (digits.length > 1 && index !== 0)) {
      if (digits.length > 1 && index !== 0) {
        const newValues = [...values];
        for (let i = 0; i < digits.length && (index + i) < length; i++) {
          newValues[index + i] = digits[i];
        }
        setValues(newValues);
        
        if (onInputChange) {
          onInputChange(newValues);
        }
        
        const nextIndex = Math.min(index + digits.length, length - 1);
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
        }, 0);
        
        const code = newValues.join('');
        if (code.length === length && onFilled) {
          setTimeout(() => {
            onFilled(code);
          }, 0);
        }
        return;
      }
      
      const digit = digits.slice(-1);
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (onInputChange) {
        onInputChange(newValues);
      }

      if (digit && index < length - 1) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }

      const code = newValues.join('');
      if (code.length === length && onFilled) {
        setTimeout(() => {
          onFilled(code);
        }, 0);
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (values[index]) {
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
        
        if (onInputChange) {
          onInputChange(newValues);
        }
      } else if (index > 0) {
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        
        if (onInputChange) {
          onInputChange(newValues);
        }
        
        inputRefs.current[index - 1]?.focus();
      }
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
    
    if (onInputChange) {
      onInputChange(newValues);
    }
    
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    
    const code = newValues.join('');
    if (code.length === length && onFilled) {
      onFilled(code);
    }
  };

  return (
    <div className={styles.container}>
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        onChange={handleHiddenInputChange}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={index === 0 ? length : 1}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onInput={index === 0 ? (e) => handleInput(index, e) : undefined}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => {
            handleFocus(index);
          }}
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

