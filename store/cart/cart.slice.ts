import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICartItem, ICartState } from './types';

const initialState: ICartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const index = state.items.findIndex(
        item => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index].countInCart += 1;
      } else {
        state.items.push({ ...action.payload, countInCart: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const index = state.items.findIndex(
        item => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index].countInCart = action.payload.quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
    batchAddToCart: (state, action: PayloadAction<ICartItem[]>) => {
      action.payload.forEach(item => {
        const index = state.items.findIndex(
          existingItem => existingItem.id === item.id,
        );
        if (index !== -1) {
          state.items[index].countInCart += 1;
        } else {
          state.items.push({ ...item, countInCart: 1 });
        }
      });
    },
    mergeCartItems: (state, action: PayloadAction<ICartItem[]>) => {
      action.payload.forEach(item => {
        const index = state.items.findIndex(
          existingItem => existingItem.id === item.id,
        );
        if (index !== -1) {
          state.items[index].countInCart += item.countInCart;
        } else {
          state.items.push(item);
        }
      });
    },
    setCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  batchAddToCart,
  mergeCartItems,
  setCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;



