'use client';

import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Overpack - Hookah Market</h1>
        <p className="text-lg mb-8">Welcome to Overpack web version</p>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm">Cart items: {cartItems.length}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Redux store is working correctly!
          </p>
        </div>
      </main>
    </div>
  );
}
