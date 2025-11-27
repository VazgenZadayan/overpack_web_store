'use client';

import React from 'react';
import { PhoneInput as InternationalPhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import 'react-international-phone/style.css';
import styles from './PhoneInput.module.css';

interface PhoneInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const phoneUtil = PhoneNumberUtil.getInstance();

export function PhoneInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  required = false,
  disabled = false,
}: PhoneInputProps<T>) {
  return (
      <Controller
        name={name}
        control={control}
        rules={{
          required,
          validate: (value) => {
            if (!value?.phoneNumber) return required ? 'Phone is required' : true;
            const fullNumber = `${value.countryCode || ''}${value.phoneNumber || ''}`;
            if (!fullNumber) return required ? 'Phone is required' : true;
            try {
              return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(fullNumber)) || 'Invalid phone number';
            } catch {
              return 'Invalid phone number';
            }
          },
        }}
        render={({ field: { onChange, value } }) => (
            <InternationalPhoneInput
              defaultCountry="am"
              forceDialCode
              preferredCountries={['am', 'ru', 'us', 'ge']}
              value={value?.phoneNumber && value?.countryCode 
                ? `${value.countryCode}${value.phoneNumber}` 
                : ''}
              onChange={(phone, meta) => {
                if (phone && meta?.country) {
                  const countryCode = `+${meta.country.dialCode}`;
                  const phoneNumber = phone.replace(countryCode, '').trim();
                  onChange({
                    countryCode,
                    phoneNumber,
                  });
                } else if (phone) {
                  // If we have phone but no meta, try to extract country code
                  const match = phone.match(/^(\+\d{1,4})(.+)$/);
                  if (match) {
                    onChange({
                      countryCode: match[1],
                      phoneNumber: match[2],
                    });
                  } else {
                    onChange({ 
                      countryCode: '', 
                      phoneNumber: phone 
                    });
                  }
                } else {
                  onChange({ 
                    countryCode: '', 
                    phoneNumber: '' 
                  });
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              inputStyle={{
                width: '100%',
                height: '55px',
                fontSize: '18px',
                fontWeight: '500',
                color: 'var(--color-dark)',
                backgroundColor: 'var(--color-white)',
                padding: '0 16px',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                border: '0.5px solid gray',
              }}
              countrySelectorStyleProps={{
                buttonStyle: {
                  height: '55px',
                  padding: '10px',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  border: '0.5px solid gray',
                  backgroundColor: 'var(--color-white)',
                },
                dropdownStyleProps: {
                  style: {
                    marginTop: '11px',
                    outline: 'none',
                  },
                  listItemStyle: {
                    padding: '12px 16px',
                    minHeight: '48px',
                  },
                  listItemCountryNameStyle: {
                    fontSize: '14px',
                    fontWeight: '600',
                  },
                  listItemDialCodeStyle: {
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  className: styles.dropdown,
                  listItemClassName: styles.dropdownItem,
                },
              }}
            />
        )}
      />
  );
}
