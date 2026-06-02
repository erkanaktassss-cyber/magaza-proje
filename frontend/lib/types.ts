export type CategoryType = 'perfume' | 'essence' | 'soap' | 'care' | 'aromatherapy' | 'candle' | 'epoxy' | 'supplies';
export type VariationType = 'ml' | 'gram' | 'renk' | 'koku' | 'adet' | 'boyut';
export type Gender = 'Kadın' | 'Erkek' | 'Unisex';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description: string;
  imageTone: string;
  featured: boolean;
}

export interface ProductVariation {
  type: VariationType;
  label: string;
  priceDelta?: number;
  stock: number;
}

export interface PerfumeDetails {
  fragranceFamily: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  gender: Gender;
  longevity: string;
  usageTime: string;
  similarScentType: string;
}

export interface NaturalDetails {
  ingredients: string;
  skinType: string;
  weight: string;
  usage: string;
  warnings: string;
}

export interface SupplyDetails {
  materialType: string;
  dimensions: string;
  compatibleProducts: string;
  packageContent: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  imageTone: string;
  badge?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isCampaign?: boolean;
  description: string;
  variants: ProductVariation[];
  perfumeDetails?: PerfumeDetails;
  naturalDetails?: NaturalDetails;
  supplyDetails?: SupplyDetails;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi';
  payment: 'Kapıda ödeme' | 'Havale / EFT' | 'Online ödeme hazırlığı';
  trackingCode?: string;
}
