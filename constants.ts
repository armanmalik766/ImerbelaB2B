
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'gid://shopify/Product/1',
    handle: 'neem-seed-kernel-shampoo-300ml',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: 'Scalp Balancing Formula | 300ml',
    benefit: 'Supports scalp health and reduces dandruff',
    price: 298.00,
    mrpPerUnit: 530.00,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['haircare', 'scalp-care', 'cleanse'],
    description: 'A science-backed cleanser formulated with high-purity Neem Seed Kernel extract, Eclipta Alba, and Shikakai to address the root causes of scalp imbalance while maintaining hair integrity.',
    howToUse: [
      'Direction to use IMERBELA Neem Seed Kernel Shampoo',
      '1.\tWet hair and scalp thoroughly with water.',
      '2.\tTake an adequate amount of IMERBELA Neem Seed Kernel Shampoo in your palm.',
      '3.\tApply evenly on scalp and hair.',
      '4.\tGently massage with fingertips to form a rich lather.',
      '5.\tLeave on for 1–2 minutes for better scalp cleansing.',
      '6.\tRinse thoroughly with water.',
      '7.\tRepeat if required.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Shampoo', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Bhringraj (Eclipta alba) whole plant extract, Shikakai (Acacia concinna) pod extract, Amla (Emblica officinalis) fruit extract, Aloe vera (Aloe barbadensis) Gel, Decyl glucoside, coco glucoside, Herbal Conditioning agents (vegetable Glycerin), sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'Is it safe for color-treated hair?', a: 'Yes, our sulfate-free formula is gentle on color-treated hair.' },
      { q: 'How often should I use it?', a: 'Suitable for daily use or 3-4 times a week depending on your scalp type.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 298.00, label: '300ml x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 289.00, label: '300ml x 06 Nos' },
      { minQty: 12, maxQty: null, price: 281.00, label: '300ml x 12 Nos' },
    ],
  },
  {
    _id: 'gid://shopify/Product/2',
    handle: 'neem-seed-kernel-shampoo-150ml',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: 'Scalp Balancing Formula | 150ml',
    benefit: 'Daily scalp-cleansing for frequent use',
    price: 158.00,
    mrpPerUnit: 280.00,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['haircare', 'scalp-care', 'cleanse', 'daily-use'],
    description: 'A compact format of our Neem Seed Kernel Shampoo for faster sell-through and trial packs.',
    howToUse: [
      'Direction to use IMERBELA Neem Seed Kernel Shampoo',
      '1.\tWet hair and scalp thoroughly with water.',
      '2.\tTake an adequate amount of IMERBELA Neem Seed Kernel Shampoo in your palm.',
      '3.\tApply evenly on scalp and hair.',
      '4.\tGently massage with fingertips to form a rich lather.',
      '5.\tLeave on for 1–2 minutes for better scalp cleansing.',
      '6.\tRinse thoroughly with water.',
      '7.\tRepeat if required.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Shampoo', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Bhringraj (Eclipta alba) whole plant extract, Shikakai (Acacia concinna) pod extract, Amla (Emblica officinalis) fruit extract, Aloe vera (Aloe barbadensis) Gel, Decyl glucoside, coco glucoside, Herbal Conditioning agents (vegetable Glycerin), sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'Is this suitable for travel retail packs?', a: 'Yes, 150ml is ideal for trial and travel formats.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 158.00, label: '150ml x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 153.00, label: '150ml x 06 Nos' },
      { minQty: 12, maxQty: null, price: 149.00, label: '150ml x 12 Nos' },
    ],
  },
  {
    _id: 'gid://shopify/Product/3',
    handle: 'neem-seed-kernel-conditioner-300ml',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: 'Intensive Hydration Therapy | 300ml',
    benefit: 'Designed to pair with Neem Seed Kernel Shampoo',
    price: 245.00,
    mrpPerUnit: 435.00,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['haircare', 'hydrate', 'condition'],
    description: 'A weightless conditioner that deeply hydrates without leaving residue. It works in synergy with our shampoo to lock in moisture and smooth the hair cuticle.',
    howToUse: [
      'How to Use',
      '1.\tAfter shampooing, apply an adequate amount of IMERBELA Neem Seed Kernel Conditioner to wet hair.',
      '2.\tGently massage into hair lengths and ends.',
      '3.\tLeave on for 2–3 minutes.',
      '4.\tRinse thoroughly with clean water.',
      '5.\tFor best results, use regularly along with IMERBELA Neem Seed Kernel Shampoo.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Conditioner', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Aloe vera (Aloe barbadensis) Gel, Herbal Conditioning Agents (vegetable glycerine), herbal conditioning base, Natural Emollients, sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'Will it weigh down fine hair?', a: 'No, our formula is designed to be lightweight and easily rinsed.' },
      { q: 'Does it contain silicones?', a: 'We are 100% silicone-free to prevent build-up.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 245.00, label: '300ml x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 238.00, label: '300ml x 06 Nos' },
      { minQty: 12, maxQty: null, price: 231.00, label: '300ml x 12 Nos' },
    ],
  },
  {
    _id: 'gid://shopify/Product/4',
    handle: 'neem-seed-kernel-conditioner-150ml',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: 'Intensive Hydration Therapy | 150ml',
    benefit: 'Compact size for regular conditioner replenishment',
    price: 129.00,
    mrpPerUnit: 230.00,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['haircare', 'hydrate', 'condition', 'daily-use'],
    description: 'A compact format of our Neem Seed Kernel Conditioner for daily-use retail and combo bundles.',
    howToUse: [
      'How to Use',
      '1.\tAfter shampooing, apply an adequate amount of IMERBELA Neem Seed Kernel Conditioner to wet hair.',
      '2.\tGently massage into hair lengths and ends.',
      '3.\tLeave on for 2–3 minutes.',
      '4.\tRinse thoroughly with clean water.',
      '5.\tFor best results, use regularly along with IMERBELA Neem Seed Kernel Shampoo.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Conditioner', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Aloe vera (Aloe barbadensis) Gel, Herbal Conditioning Agents (vegetable glycerine), herbal conditioning base, Natural Emollients, sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'Is this ideal for starter bundles?', a: 'Yes, 150ml variant is ideal for starter and trial bundles.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 129.00, label: '150ml x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 126.00, label: '150ml x 06 Nos' },
      { minQty: 12, maxQty: null, price: 122.00, label: '150ml x 12 Nos' },
    ],
  },
  {
    _id: 'gid://shopify/Product/5',
    handle: 'neem-seed-kernel-hair-serum',
    title: 'Neem Kernel Seeds Serum',
    subtitle: 'with Ginseng and B5 | 30ml',
    benefit: 'Clinical strength hair follicle support',
    price: 319.00,
    mrpPerUnit: 570.00,
    imageUrl: '/serum.jpeg',
    category: 'serum',
    tags: ['haircare', 'scalp-care', 'treatment', 'regrowth'],
    description: 'A potent, lightweight serum enriched with Ginseng and Pro-Vitamin B5. Designed for daily leave-on application to stimulate the scalp.',
    howToUse: [
      'Directions for Use /How to Use',
      'IMERBELA Neem Seed Kernel Hair Growth Serum',
      '1.\tPrepare the Scalp',
      'For best results, apply on a clean scalp after washing. The Hair Growth serum can be used on a slightly damp scalp or on a dry scalp as well.',
      '2.\tSection the Hair',
      'Divide hair into small, manageable sections so the dropper reaches the scalp directly, not just the hair strands.',
      '3.\tApply the Hair Growth Serum',
      'Using the dropper, apply 2–3 drops directly onto the scalp in each section. Focus on areas of concern such as the hairline, crown, or thinning zones.',
      '4.\tMassage Gently Hair Growth Serum',
      'Massage the Hair Growth serum into the scalp using fingertips in gentle circular motions for 2–3 minutes to help improve circulation and absorption.',
      '5.\tLeave-In Treatment',
      'Do not rinse. Leave the Hair Growth Serum on to allow the active ingredients to work effectively.',
      '6.\tUsage Frequency',
      'Use 3–4 drops (pea-sized amount) per application on average. Quantity may vary depending on scalp condition and hair density.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Hair Growth Serum', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Ginseng (Panax Ginseng) Root Extract, Burdock (Arctium Majus) Root Extract, Hydrolyzed Soy Protein, provitamin B5, Aloe vera (Aloe barbadensis) gel, plant keratin, plant-based Biotin, vegetable glycerin, sodium Benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'Does it feel greasy?', a: 'No, it is an aqueous, non-oily formula.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 319.00, label: '30ml x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 309.00, label: '30ml x 06 Nos' },
      { minQty: 12, maxQty: null, price: 300.00, label: '30ml x 12 Nos' },
    ],
  },
  {
    _id: 'gid://shopify/Product/6',
    handle: 'imerbela-neem-seed-kernel-hair-care-kit',
    title: 'Imerbela Neem Seed Kernel Hair Care Kit',
    subtitle: 'Shampoo 150ml + Conditioner 150ml + Serum 15ml',
    benefit: 'Complete starter regimen in one combo pack',
    price: 419.00,
    mrpPerUnit: 750.00,
    imageUrl: '/kit.png',
    category: 'kit',
    tags: ['haircare', 'combo', 'regimen', 'starter-kit'],
    description: 'A complete hair care combo with shampoo, conditioner, and serum designed for high-value reseller bundles.',
    howToUse: [
      'Direction to use IMERBELA Neem Seed Kernel Shampoo',
      '1.\tWet hair and scalp thoroughly with water.',
      '2.\tTake an adequate amount of IMERBELA Neem Seed Kernel Shampoo in your palm.',
      '3.\tApply evenly on scalp and hair.',
      '4.\tGently massage with fingertips to form a rich lather.',
      '5.\tLeave on for 1–2 minutes for better scalp cleansing.',
      '6.\tRinse thoroughly with water.',
      '7.\tRepeat if required.',
      '',
      'How to Use',
      '1.\tAfter shampooing, apply an adequate amount of IMERBELA Neem Seed Kernel Conditioner to wet hair.',
      '2.\tGently massage into hair lengths and ends.',
      '3.\tLeave on for 2–3 minutes.',
      '4.\tRinse thoroughly with clean water.',
      '5.\tFor best results, use regularly along with IMERBELA Neem Seed Kernel Shampoo.',
      '',
      'Directions for Use /How to Use',
      'IMERBELA Neem Seed Kernel Hair Growth Serum',
      '1.\tPrepare the Scalp',
      'For best results, apply on a clean scalp after washing. The Hair Growth serum can be used on a slightly damp scalp or on a dry scalp as well.',
      '2.\tSection the Hair',
      'Divide hair into small, manageable sections so the dropper reaches the scalp directly, not just the hair strands.',
      '3.\tApply the Hair Growth Serum',
      'Using the dropper, apply 2–3 drops directly onto the scalp in each section. Focus on areas of concern such as the hairline, crown, or thinning zones.',
      '4.\tMassage Gently Hair Growth Serum',
      'Massage the Hair Growth serum into the scalp using fingertips in gentle circular motions for 2–3 minutes to help improve circulation and absorption.',
      '5.\tLeave-In Treatment',
      'Do not rinse. Leave the Hair Growth Serum on to allow the active ingredients to work effectively.',
      '6.\tUsage Frequency',
      'Use 3–4 drops (pea-sized amount) per application on average. Quantity may vary depending on scalp condition and hair density.'
    ],
    ingredients: [
      { name: 'IMERBELA Neem Seed Kernel Shampoo', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Bhringraj (Eclipta alba) whole plant extract, Shikakai (Acacia concinna) pod extract, Amla (Emblica officinalis) fruit extract, Aloe vera (Aloe barbadensis) Gel, Decyl glucoside, coco glucoside, Herbal Conditioning agents (vegetable Glycerin), sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' },
      { name: 'IMERBELA Neem Seed Kernel Conditioner', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Aloe vera (Aloe barbadensis) Gel, Herbal Conditioning Agents (vegetable glycerine), herbal conditioning base, Natural Emollients, sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' },
      { name: 'IMERBELA Neem Seed Kernel Hair Growth Serum', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Ginseng (Panax Ginseng) Root Extract, Burdock (Arctium Majus) Root Extract, Hydrolyzed Soy Protein, provitamin B5, Aloe vera (Aloe barbadensis) gel, plant keratin, plant-based Biotin, vegetable glycerin, sodium Benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ],
    faqs: [
      { q: 'What does this kit include?', a: 'Shampoo 150ml, Conditioner 150ml, and Serum 15ml.' }
    ],
    moq: 3,
    isB2BOnly: true,
    bulkPricing: [
      { minQty: 3, maxQty: 5, price: 419.00, label: 'Kit x 03 Nos' },
      { minQty: 6, maxQty: 11, price: 407.00, label: 'Kit x 06 Nos' },
      { minQty: 12, maxQty: null, price: 395.00, label: 'Kit x 12 Nos' },
    ],
  }
];

export const BRAND_COLORS = {
  primary: '#111111',
  secondary: '#666666',
  accent: '#6B8E23',
  white: '#FFFFFF',
  border: '#E5E5E5'
};

// Helper: Get the price for a given quantity based on bulk pricing tiers
export const getBulkPrice = (product: Product, quantity: number): number => {
  if (!product.bulkPricing || product.bulkPricing.length === 0) {
    return product.price;
  }
  for (let i = product.bulkPricing.length - 1; i >= 0; i--) {
    const tier = product.bulkPricing[i];
    if (quantity >= tier.minQty) {
      return tier.price;
    }
  }
  return product.price;
};
