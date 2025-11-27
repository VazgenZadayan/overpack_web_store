import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../service';
import { IBaseSuccessResponse } from '../types';

import {
  ISendSMSRequest,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IVerifySMSReQuest,
  IVerifySMSResponse,
} from './types';

export const authAPI = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['Auth'],
  endpoints: builder => ({
    sendSMSToUser: builder.mutation<IBaseSuccessResponse, ISendSMSRequest>({
      query: ({ phone }) => ({
        url: 'user/sms/send',
        method: 'POST',
        body: {
          phone,
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    verifySMS: builder.mutation<IVerifySMSResponse, IVerifySMSReQuest>({
      query: ({ phone, code }) => ({
        url: 'user/sms/verify',
        method: 'POST',
        body: {
          phone,
          code,
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    signUp: builder.mutation<IBaseSuccessResponse, ISignUpRequest>({
      query: credentials => ({
        url: '/user/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signIn: builder.mutation<ISignInResponse, ISignInRequest>({
      query: credentials => ({
        url: 'user/auth',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useSendSMSToUserMutation,
  useVerifySMSMutation,
  useSignUpMutation,
  useSignInMutation,
} = authAPI;



