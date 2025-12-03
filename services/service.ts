import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { paramsSerializer } from './helpers';
import { API } from './constants';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API,
  paramsSerializer,
  prepareHeaders: (headers) => {
    const token = getCookie('token');
    
    if (token) {
      headers.set('token', token);
    }
    
    const lang = typeof document !== 'undefined' 
      ? document.documentElement.lang 
      : 'en';
    headers.set('Accept-Language', lang === 'am' ? 'hy' : lang);
    
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let modifiedArgs = args;
  
  let language = 'en';
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && ['en', 'ru', 'am', 'hy'].includes(htmlLang)) {
      language = htmlLang === 'am' ? 'hy' : htmlLang;
    }
  }
  
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



