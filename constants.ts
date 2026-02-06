
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'neem-seed-kernel-shampoo',
    title: 'Neem Seed Kernel Shampoo',
    subtitle: 'Scalp Balancing Formula | 300ml',
    benefit: 'Supports scalp health and reduces dandruff',
    price: 24.00,
    imageUrl: './im1.jpeg',
    category: 'shampoo',
    tags: ['haircare', 'scalp-care', 'cleanse'],
    description: 'A science-backed cleanser formulated with high-purity Neem Seed Kernel extract, Eclipta Alba, and Shikakai to address the root causes of scalp imbalance while maintaining hair integrity.',
    howToUse: [
      'Apply to wet hair and scalp.',
      'Massage gently to create a rich lather.',
      'Rinse thoroughly with lukewarm water.',
      'Follow with IMERBELA Conditioner for best results.'
    ],
    ingredients: [
      { name: 'Neem Seed Kernel', benefit: 'Anti-bacterial and anti-fungal properties for scalp health.' },
      { name: 'Bhringraj (Eclipta Alba)', benefit: 'Ancient herb known for hair regrowth and scalp cooling.' },
      { name: 'Shikakai', benefit: 'Natural cleanser that strengthens hair roots.' }
    ],
    faqs: [
      { q: 'Is it safe for color-treated hair?', a: 'Yes, our sulfate-free formula is gentle on color-treated hair.' },
      { q: 'How often should I use it?', a: 'Suitable for daily use or 3-4 times a week depending on your scalp type.' }
    ]
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'neem-seed-kernel-conditioner',
    title: 'Neem Seed Kernel Conditioner',
    subtitle: 'Intensive Hydration Therapy | 300ml',
    benefit: 'Designed to pair with Neem Seed Kernel Shampoo',
    price: 26.00,
    imageUrl: './im2.jpeg',
    category: 'conditioner',
    tags: ['haircare', 'hydrate', 'condition'],
    description: 'A weightless conditioner that deeply hydrates without leaving residue. It works in synergy with our shampoo to lock in moisture and smooth the hair cuticle.',
    howToUse: [
      'After shampooing, apply to hair lengths and ends.',
      'Leave on for 2-3 minutes.',
      'Rinse thoroughly.',
      'Use daily for optimal softness.'
    ],
    ingredients: [
      { name: 'Neem Oil', benefit: 'Adds a protective layer to the hair shaft.' },
      { name: 'Coconut Oil', benefit: 'Penetrates deep into the cortex for moisture.' },
      { name: 'Shea Butter', benefit: 'Softens hair and reduces frizz.' }
    ],
    faqs: [
      { q: 'Will it weigh down fine hair?', a: 'No, our formula is designed to be lightweight and easily rinsed.' },
      { q: 'Does it contain silicones?', a: 'We are 100% silicone-free to prevent build-up.' }
    ]
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'neem-seed-kernel-hair-serum',
    title: 'Neem Seed Kernel Hair Serum',
    subtitle: 'with Ginseng and B5 | 30ml',
    benefit: 'Clinical strength hair follicle support',
    price: 45.00,
    imageUrl: 'im4.jpeg',
    category: 'serum',
    tags: ['haircare', 'scalp-care', 'treatment', 'regrowth'],
    description: 'A potent, lightweight serum enriched with Ginseng and Pro-Vitamin B5. Designed for daily leave-on application to stimulate the scalp.',
    howToUse: [
      'Apply to scalp nighty.',
      'Massage gently.',
      'Do not rinse.'
    ],
    ingredients: [
      { name: 'Ginseng Root', benefit: 'Increases dermal cells on the scalp.' },
      { name: 'Pro-Vitamin B5', benefit: 'Essential nutrients for thickness.' }
    ],
    faqs: [
      { q: 'Does it feel greasy?', a: 'No, it is an aqueous, non-oily formula.' }
    ]
  }
];

export const BRAND_COLORS = {
  primary: '#111111',
  secondary: '#666666',
  accent: '#6B8E23',
  white: '#FFFFFF',
  border: '#E5E5E5'
};
