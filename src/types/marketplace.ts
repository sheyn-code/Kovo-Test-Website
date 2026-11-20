export enum Category {
  All = 'All',
  Women = 'Women',
  Men = 'Men',
  Footwear = 'Footwear',
  Accessories = 'Accessories',
  Beauty = 'Beauty',
}

export enum SortOption {
  Featured = 'featured',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
  TopRated = 'top-rated',
}

export enum PaymentMethod {
  Card = 'card',
  CashOnDelivery = 'cod',
}

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  fit: 'Runs Small' | 'True to Size' | 'Runs Large';
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: Exclude<Category, Category.All>;
  subcategory: string;
  tag?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  colors: ColorVariant[];
  sizes: string[];
  stock: number;
  description: string;
  material: string;
  care: string;
  featuredRank: number;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'Confirmed — Preparing Shipment' | 'Dispatched';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  shipping: ShippingDetails;
}
