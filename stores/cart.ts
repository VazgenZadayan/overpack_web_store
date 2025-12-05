import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICartItem } from '@/shared/types/cart';

interface CartState {
  items: ICartItem[];
  totalItems: number;
  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  batchAddToCart: (items: ICartItem[]) => void;
  mergeCartItems: (items: ICartItem[]) => void;
  setCart: (items: ICartItem[]) => void;
}

const calculateTotalItems = (items: ICartItem[]): number => {
  return items.reduce((sum, item) => sum + item.countInCart, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      addToCart: (item) =>
        set((state) => {
          const index = state.items.findIndex((i) => i.id === item.id);
          let newItems: ICartItem[];
          if (index !== -1) {
            newItems = [...state.items];
            newItems[index] = {
              ...newItems[index],
              countInCart: newItems[index].countInCart + 1,
            };
          } else {
            newItems = [...state.items, { ...item, countInCart: 1 }];
          }
          return { items: newItems, totalItems: calculateTotalItems(newItems) };
        }),
      removeFromCart: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          return { items: newItems, totalItems: calculateTotalItems(newItems) };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, countInCart: quantity } : item
          );
          return { items: newItems, totalItems: calculateTotalItems(newItems) };
        }),
      clearCart: () => set({ items: [], totalItems: 0 }),
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
          return { items: newItems, totalItems: calculateTotalItems(newItems) };
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
          return { items: newItems, totalItems: calculateTotalItems(newItems) };
        }),
      setCart: (items) => set({ items, totalItems: calculateTotalItems(items) }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.totalItems = calculateTotalItems(state.items);
        }
      },
    }
  )
);

