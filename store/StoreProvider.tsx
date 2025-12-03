'use client';

import { useMemo, useEffect } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from './store';
import { setCart } from './cart/cart.slice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo<AppStore>(() => makeStore(), []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          store.dispatch(setCart(items));
        } catch (e) {
          console.error('Failed to load cart from localStorage:', e);
        }
      }
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}


