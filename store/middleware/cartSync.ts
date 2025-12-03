import { Middleware } from '@reduxjs/toolkit';

export const cartSyncMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const typedAction = action as { type: string };
    if (typedAction.type?.startsWith('cart/')) {
      const state = store.getState();
      if (typeof window !== 'undefined') {
        try {
          const cartState = state as { cart: { items: unknown[] } };
          localStorage.setItem('cart', JSON.stringify(cartState.cart.items));
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error);
        }
      }
    }
  }
  
  return result;
};

