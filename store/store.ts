import { configureStore } from '@reduxjs/toolkit';

import { authAPI } from '@/services/auth/auth';
import { cartReducer } from './cart/cart.slice';
import { toastReducer } from './toast/toast.slice';
import { cartSyncMiddleware } from './middleware/cartSync';

export function makeStore() {
  return configureStore({
    reducer: {
      toast: toastReducer,
      cart: cartReducer,
      [authAPI.reducerPath]: authAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['toast.onClose', 'toast.icon'],
        },
      })
        .concat(authAPI.middleware)
        .concat(cartSyncMiddleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
