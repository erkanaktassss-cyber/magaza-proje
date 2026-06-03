import catalog from '../data/catalog.json';
import { Category, Product } from './types';

export const whatsappNumber = catalog.whatsappNumber;
export const categories = catalog.categories as Category[];
export const products = catalog.products as Product[];

export const featuredProducts = products.filter((product) => product.isBestSeller || product.isNew).slice(0, 8);
export const campaignProducts = products.filter((product) => product.isCampaign);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
export const categoryById = (id: string) => categories.find((category) => category.id === id);
export const productsByCategorySlug = (slug: string) => {
  const category = categoryBySlug(slug);
  return category ? products.filter((product) => product.categoryId === category.id) : [];
};
