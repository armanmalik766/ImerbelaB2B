
export interface Product {
  _id: string;
  handle: string;
  title: string;
  subtitle: string;
  benefit: string;
  price: number;
  mrpPerUnit: number;
  imageUrl: string;
  category: 'shampoo' | 'conditioner' | 'oil' | 'serum' | 'kit';
  tags: string[];
  description: string;
  howToUse: string[];
  ingredients: { name: string; benefit: string }[];
  faqs: { q: string; a: string }[];
  moq: number;
  isB2BOnly: boolean;
  bulkPricing?: BulkPricingTier[];
}

export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
  label: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SectionSettings {
  heading: string;
  subtextText: string;
  limit: number;
  showPairingLabel: boolean;
}

export type Page = 'home' | 'product' | 'ingredients' | 'about' | 'contact' | 'become-seller' | 'seller-login' | 'seller-dashboard' | 'admin' | 'wholesale' | 'bulk-order' | 'distributor-program';
