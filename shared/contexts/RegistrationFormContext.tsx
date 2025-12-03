'use client';

import React from 'react';
import { FormProvider, useForm, Resolver } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { IRegistrationFormData } from '@/services/auth/types';

const defaultValues: IRegistrationFormData = {
  phone: {
    countryCode: '+374',
    phoneNumber: '',
  },
  checkbox: false,
  code: '',
  documentNumber: '',
  name: '',
  type: 1,
};

const getValidationSchema = (t: (key: string) => string) =>
  Yup.object<IRegistrationFormData>().shape({
    phone: Yup.object().shape({
      countryCode: Yup.string().optional(),
      phoneNumber: Yup.string().optional(),
    }),
    checkbox: Yup.boolean()
      .required()
      .test('is-true', t('phoneNumber.validation.terms'), value => !!value),
    code: Yup.string().required(t('smsCode.validation.required')),
    name: Yup.string().required(t('client.name.placeholder')),
    type: Yup.mixed<IRegistrationFormData['type']>()
      .oneOf([1, 2])
      .required(t('userType.title')),
    documentNumber: Yup.string().optional().when('type', {
      is: 2,
      then: schema => schema.required(t('partner.tin.placeholder')),
      otherwise: schema => schema.optional(),
    }),
  });

export const RegistrationFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const t = useTranslations('Auth');
  const methods = useForm<IRegistrationFormData>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(getValidationSchema(t)) as Resolver<IRegistrationFormData>,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

