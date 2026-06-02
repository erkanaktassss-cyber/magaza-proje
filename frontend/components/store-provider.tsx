'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { products } from '../lib/data';
import { Product } from '../lib/types';

type CartLine = { product: Product; quantity: number; variant?: string };
type StoreContextValue = {
  cart: CartLine[];
  favorites: string[];
  addToCart: (product: Product, variant?: string) => void;
  removeFromCart: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartTotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToCart = (product: Product, variant?: string) => {
    setCart((current) => {
      const key = `${product.id}-${variant ?? 'default'}`;
      const existing = current.find((line) => `${line.product.id}-${line.variant ?? 'default'}` === key);
      if (existing) {
        return current.map((line) => `${line.product.id}-${line.variant ?? 'default'}` === key ? { ...line, quantity: line.quantity + 1 } : line);
      }
      return [...current, { product, quantity: 1, variant }];
    });
  };

  const removeFromCart = (id: string) => setCart((current) => current.filter((line) => line.product.id !== id));
  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const isFavorite = (id: string) => favorites.includes(id);
  const cartTotal = useMemo(() => cart.reduce((sum, line) => sum + (line.product.discountedPrice ?? line.product.price) * line.quantity, 0), [cart]);

  return <StoreContext.Provider value={{ cart, favorites, addToCart, removeFromCart, toggleFavorite, isFavorite, cartTotal }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}

export const allStoreProducts = products;
