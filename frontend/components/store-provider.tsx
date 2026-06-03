'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Product, StoreLine } from '../lib/types';

type StoreContextValue = {
  cart: StoreLine[];
  favorites: string[];
  addToCart: (product: Product, variant?: string) => void;
  removeFromCart: (id: string, variant?: string) => void;
  changeQuantity: (id: string, variant: string | undefined, quantity: number) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartTotal: number;
  cartCount: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const lineKey = (id: string, variant?: string) => `${id}:${variant ?? 'Standart'}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToCart = (product: Product, variant?: string) => {
    setCart((current) => {
      const key = lineKey(product.id, variant);
      const existing = current.find((line) => lineKey(line.product.id, line.variant) === key);
      if (existing) {
        return current.map((line) => (lineKey(line.product.id, line.variant) === key ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...current, { product, quantity: 1, variant: variant ?? product.variants[0]?.label ?? 'Standart' }];
    });
  };

  const removeFromCart = (id: string, variant?: string) => setCart((current) => current.filter((line) => lineKey(line.product.id, line.variant) !== lineKey(id, variant)));
  const changeQuantity = (id: string, variant: string | undefined, quantity: number) => setCart((current) => current.map((line) => lineKey(line.product.id, line.variant) === lineKey(id, variant) ? { ...line, quantity: Math.max(1, quantity) } : line));
  const toggleFavorite = (id: string) => setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const isFavorite = (id: string) => favorites.includes(id);
  const cartTotal = useMemo(() => cart.reduce((sum, line) => sum + (line.product.discountedPrice ?? line.product.price) * line.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);

  return <StoreContext.Provider value={{ cart, favorites, addToCart, removeFromCart, changeQuantity, toggleFavorite, isFavorite, cartTotal, cartCount }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
