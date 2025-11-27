import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { secureStorage } from '@/utils/storage';
import { paramsSerializer } from './helpers';

import { API } from './constants';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API,
  paramsSerializer,
  prepareHeaders: (headers) => {
    const token = secureStorage.getItem('token');
    if (token) {
      headers.set('token', token);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let modifiedArgs = args;
  
  // Get language from localStorage or default to 'en'
  let language = 'en';
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      try {
        const parsed = JSON.parse(storedLanguage);
        language = ['en', 'ru', 'hy'].includes(parsed) ? parsed : 'en';
      } catch {
        language = 'en';
      }
    }
  }
  
  // Convert 'hy' to 'am' for API
  const apiLanguage = language === 'hy' ? 'am' : language;
  
  if (typeof args === 'string') {
    modifiedArgs = { url: args };
  }
  (modifiedArgs as FetchArgs).params = {
    ...(modifiedArgs as FetchArgs).params,
    language: apiLanguage,
  };
  
  return rawBaseQuery(modifiedArgs, api, extraOptions);
};

export { baseQuery };



