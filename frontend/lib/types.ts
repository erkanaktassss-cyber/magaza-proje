export type CategoryId = 'parfum' | 'esans' | 'dogal-sabun' | 'dogal-krem' | 'aromaterapi' | 'mum' | 'kalip-ambalaj';
export type VariationType = 'ml' | 'gram' | 'adet' | 'koku' | 'boyut' | 'renk' | 'set';

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  accent: string;
  featured?: boolean;
}

export interface ProductVariation {
  type: VariationType;
  label: string;
  priceDelta?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  image: string;
  gallery: string[];
  badge?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isCampaign?: boolean;
  description: string;
  longDescription: string;
  notes: string[];
  ritual: string;
  variants: ProductVariation[];
}

export interface StoreLine {
  product: Product;
  quantity: number;
  variant?: string;
}
