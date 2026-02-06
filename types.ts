
export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  benefit: string;
  price: number;
  imageUrl: string;
  category: 'shampoo' | 'conditioner' | 'oil' | 'serum';
  tags: string[];
  description: string;
  howToUse: string[];
  ingredients: { name: string; benefit: string }[];
  faqs: { q: string; a: string }[];
}

export interface SectionSettings {
  heading: string;
  subtextText: string;
  limit: number;
  showPairingLabel: boolean;
}

export type Page = 'home' | 'product' | 'ingredients' | 'about' | 'contact';
