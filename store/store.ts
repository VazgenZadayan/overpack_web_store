import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { cartReducer } from './cart/cart.slice';
import { confirmDialogReducer } from './confirm-dialog/confirm-dialog.slice';
import { toastReducer } from './toast/toast.slice';

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'],
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    confirmDialog: confirmDialogReducer,
    toast: toastReducer,
    cart: persistedCartReducer,
    // API reducers will be added here
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

