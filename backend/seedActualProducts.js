const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Data from Imerbela Reseller Price List 2026-2027
const products = [
  // 1. Neem Kernel Seeds Shampoo 300ml
  {
    handle: 'shampoo-300ml-3nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '300ml X 03 Nos',
    benefit: 'Scalp balance pack of 3',
    price: 894, // Selling Amt
    mrpPerUnit: 1590, // MRP for 3
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['300ml', '3nos', 'bundle'],
    description: 'A professional-grade scalp balancing cleanser in a seller pack of 3. Formulated with high-purity Neem Seed Kernel extract.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'shampoo-300ml-6nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '300ml X 06 Nos',
    benefit: 'Scalp balance pack of 6',
    price: 1734,
    mrpPerUnit: 3180,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['300ml', '6nos', 'bundle'],
    description: 'A professional-grade scalp balancing cleanser in a seller pack of 6. Ideal for medium-sized retail shelf space.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'shampoo-300ml-12nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '300ml X 12 Nos',
    benefit: 'Scalp balance pack of 12',
    price: 3372,
    mrpPerUnit: 6360,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['300ml', '12nos', 'bundle'],
    description: 'A professional-grade scalp balancing cleanser in a bulk seller pack of 12. Maximum profit margin for premium partners.',
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
    moq: 1,
    isActive: true,
  },

  // 2. Neem Kernel Seeds Shampoo 150ml
  {
    handle: 'shampoo-150ml-3nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '150ml X 03 Nos',
    benefit: 'Compact scalp cleanser pack of 3',
    price: 474,
    mrpPerUnit: 840,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['150ml', '3nos', 'bundle'],
    description: 'Travel-friendly size in a seller pack of 3.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'shampoo-150ml-6nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '150ml X 06 Nos',
    benefit: 'Compact scalp cleanser pack of 6',
    price: 918,
    mrpPerUnit: 1680,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['150ml', '6nos', 'bundle'],
    description: 'Travel-friendly size in a seller pack of 6.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'shampoo-150ml-12nos',
    title: 'Neem Kernel Seeds Shampoo',
    subtitle: '150ml X 12 Nos',
    benefit: 'Compact scalp cleanser pack of 12',
    price: 1788,
    mrpPerUnit: 3360,
    imageUrl: '/shampoo-150ml.png',
    category: 'shampoo',
    tags: ['150ml', '12nos', 'bundle'],
    description: 'Travel-friendly size in a seller pack of 12.',
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
    moq: 1,
    isActive: true,
  },

  // 3. Neem Kernel Seeds Conditioner 300ml
  {
    handle: 'conditioner-300ml-3nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '300ml X 03 Nos',
    benefit: 'Hydration therapy pack of 3',
    price: 735,
    mrpPerUnit: 1305,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['300ml', '3nos', 'bundle'],
    description: 'Intensive hydration therapy in a seller pack of 3.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'conditioner-300ml-6nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '300ml X 06 Nos',
    benefit: 'Hydration therapy pack of 6',
    price: 1428,
    mrpPerUnit: 2610,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['300ml', '6nos', 'bundle'],
    description: 'Intensive hydration therapy in a seller pack of 6.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'conditioner-300ml-12nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '300ml X 12 Nos',
    benefit: 'Hydration therapy pack of 12',
    price: 2772,
    mrpPerUnit: 5220,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['300ml', '12nos', 'bundle'],
    description: 'Intensive hydration therapy in a seller pack of 12.',
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
    moq: 1,
    isActive: true,
  },

  // 4. Neem Kernel Seeds Conditioner 150ml
  {
    handle: 'conditioner-150ml-3nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '150ml X 03 Nos',
    benefit: 'Compact hydration therapy pack of 3',
    price: 387,
    mrpPerUnit: 690,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['150ml', '3nos', 'bundle'],
    description: 'Travel size hydration therapy in a pack of 3.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'conditioner-150ml-6nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '150ml X 06 Nos',
    benefit: 'Compact hydration therapy pack of 6',
    price: 756,
    mrpPerUnit: 1380,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['150ml', '6nos', 'bundle'],
    description: 'Travel size hydration therapy in a pack of 6.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'conditioner-150ml-12nos',
    title: 'Neem Kernel Seeds Conditioner',
    subtitle: '150ml X 12 Nos',
    benefit: 'Compact hydration therapy pack of 12',
    price: 1464,
    mrpPerUnit: 2760,
    imageUrl: '/conditioner-150ml.png',
    category: 'conditioner',
    tags: ['150ml', '12nos', 'bundle'],
    description: 'Travel size hydration therapy in a pack of 12.',
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
    moq: 1,
    isActive: true,
  },

  // 5. Neem Kernel Seeds Serum 30ml
  {
    handle: 'serum-30ml-3nos',
    title: 'Neem Kernel Seeds Serum',
    subtitle: '30ml X 03 Nos',
    benefit: 'Follicle support pack of 3',
    price: 957,
    mrpPerUnit: 1710,
    imageUrl: '/serum.jpeg',
    category: 'serum',
    tags: ['30ml', '3nos', 'bundle'],
    description: 'Clinical strength hair follicle support in a seller pack of 3.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'serum-30ml-6nos',
    title: 'Neem Kernel Seeds Serum',
    subtitle: '30ml X 06 Nos',
    benefit: 'Follicle support pack of 6',
    price: 1854,
    mrpPerUnit: 3420,
    imageUrl: '/serum.jpeg',
    category: 'serum',
    tags: ['30ml', '6nos', 'bundle'],
    description: 'Clinical strength hair follicle support in a seller pack of 6.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'serum-30ml-12nos',
    title: 'Neem Kernel Seeds Serum',
    subtitle: '30ml X 12 Nos',
    benefit: 'Follicle support pack of 12',
    price: 3600,
    mrpPerUnit: 6840,
    imageUrl: '/serum.jpeg',
    category: 'serum',
    tags: ['30ml', '12nos', 'bundle'],
    description: 'Clinical strength hair follicle support in a seller pack of 12.',
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
    moq: 1,
    isActive: true,
  },

  // 6. Hair Care Kit
  {
    handle: 'hair-care-kit-3nos',
    title: 'Neem Seed Kernel Hair Care Kit',
    subtitle: 'Kit X 03 Nos',
    benefit: 'Complete starter regimen pack of 3',
    price: 1257,
    mrpPerUnit: 2250,
    imageUrl: '/kit.png',
    category: 'kit',
    tags: ['kit', '3nos', 'bundle'],
    description: 'Complete hair care combo with shampoo, conditioner, and serum. Pack of 3.',
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
      { name: 'Neem Kernel Shampoo', benefit: 'Aqua, Neem Extract, Bhringraj, Shikakai, Amla, Aloe Vera, Decyl & Coco Glucoside.' },
      { name: 'Neem Kernel Conditioner', benefit: 'Aqua, Neem Extract, Aloe Vera Gel, Herbal Conditioning Agents, Natural Emollients.' },
      { name: 'Neem Growth Serum', benefit: 'Aqua, Neem Extract, Ginseng, Burdock Root, Soy Protein, B5, Biotin, Keratin.' }
    ],
    moq: 1,
    isActive: true,
  },
  {
    handle: 'hair-care-kit-6nos',
    title: 'Neem Seed Kernel Hair Care Kit',
    subtitle: 'Kit X 06 Nos',
    benefit: 'Complete starter regimen pack of 6',
    price: 2442,
    mrpPerUnit: 4500,
    imageUrl: '/kit.png',
    category: 'kit',
    tags: ['kit', '6nos', 'bundle'],
    description: 'Complete hair care combo with shampoo, conditioner, and serum. Pack of 6.',
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
    moq: 1,
    isActive: true,
  },
  {
    handle: 'hair-care-kit-12nos',
    title: 'Neem Seed Kernel Hair Care Kit',
    subtitle: 'Kit X 12 Nos',
    benefit: 'Complete starter regimen pack of 12',
    price: 4740,
    mrpPerUnit: 9000,
    imageUrl: '/kit.png',
    category: 'kit',
    tags: ['kit', '12nos', 'bundle'],
    description: 'Complete hair care combo with shampoo, conditioner, and serum. Pack of 12.',
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
      { name: 'Neem Kernel Shampoo', benefit: 'Aqua, Neem Extract, Bhringraj, Shikakai, Amla, Aloe Vera, Decyl & Coco Glucoside.' },
      { name: 'Neem Kernel Conditioner', benefit: 'Aqua, Neem Extract, Aloe Vera Gel, Herbal Conditioning Agents, Natural Emollients.' },
      { name: 'Neem Growth Serum', benefit: 'Aqua, Neem Extract, Ginseng, Burdock Root, Soy Protein, B5, Biotin, Keratin.' }
    ],
    moq: 1,
    isActive: true,
  }
];

async function seedActualProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for ACTUAL Imerbela Bundle seeding');

    // Clear everything first to reset to the bundle-only catalog
    await Product.deleteMany({});
    console.log('🗑️  Cleared old unit-based products');
    
    for (const p of products) {
      await Product.create(p);
    }

    console.log('✅ Bundle-based Imerbela products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedActualProducts();
