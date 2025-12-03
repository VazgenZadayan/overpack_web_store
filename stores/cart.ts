import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICartItem } from '@/shared/types/cart';

interface CartState {
  items: ICartItem[];
  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  batchAddToCart: (items: ICartItem[]) => void;
  mergeCartItems: (items: ICartItem[]) => void;
  setCart: (items: ICartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) =>
        set((state) => {
          const index = state.items.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            const newItems = [...state.items];
            newItems[index] = {
              ...newItems[index],
              countInCart: newItems[index].countInCart + 1,
            };
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, countInCart: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, countInCart: quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      batchAddToCart: (items) =>
        set((state) => {
          const newItems = [...state.items];
          items.forEach((item) => {
            const index = newItems.findIndex((i) => i.id === item.id);
            if (index !== -1) {
              newItems[index] = {
                ...newItems[index],
                countInCart: newItems[index].countInCart + 1,
              };
            } else {
              newItems.push({ ...item, countInCart: 1 });
            }
          });
          return { items: newItems };
        }),
      mergeCartItems: (items) =>
        set((state) => {
          const newItems = [...state.items];
          items.forEach((item) => {
            const index = newItems.findIndex((i) => i.id === item.id);
            if (index !== -1) {
              newItems[index] = {
                ...newItems[index],
                countInCart: newItems[index].countInCart + item.countInCart,
              };
            } else {
              newItems.push(item);
            }
          });
          return { items: newItems };
        }),
      setCart: (items) => set({ items }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

