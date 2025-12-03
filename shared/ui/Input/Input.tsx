'use client';

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Typography } from '../Typography/Typography';
import styles from './Input.module.css';

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'decimal';
}

export function Input<T extends FieldValues>({
  name,
  control,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  inputMode,
}: InputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? 'This field is required' : false }}
      render={({ field, fieldState: { error } }) => (
        <div className={styles.container}>
          <input
            {...field}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.input}
            style={{
              borderColor: error ? 'var(--color-error, #ef4444)' : 'var(--color-gray)',
            }}
          />
          {error && (
            <Typography
              variant="bodyXSMed"
              style={{ color: 'var(--color-error, #ef4444)', marginTop: '4px' }}
            >
              {error.message || 'This field is required'}
            </Typography>
          )}
        </div>
      )}
    />
  );
}

