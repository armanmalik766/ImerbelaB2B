const fs = require('fs');

const filePaths = [
  './backend/seedActualProducts.js',
  './constants.ts'
];

const shampooHowToUse = `[
      'Direction to use IMERBELA Neem Seed Kernel Shampoo',
      '1.\\tWet hair and scalp thoroughly with water.',
      '2.\\tTake an adequate amount of IMERBELA Neem Seed Kernel Shampoo in your palm.',
      '3.\\tApply evenly on scalp and hair.',
      '4.\\tGently massage with fingertips to form a rich lather.',
      '5.\\tLeave on for 1–2 minutes for better scalp cleansing.',
      '6.\\tRinse thoroughly with water.',
      '7.\\tRepeat if required.'
    ]`;

const shampooIngredients = `[
      { name: 'Ingredients  IMERBELA Neem Seed Kernel Shampoo :', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Bhringraj (Eclipta alba) whole plant extract, Shikakai (Acacia concinna) pod extract, Amla (Emblica officinalis) fruit extract, Aloe vera (Aloe barbadensis) Gel, Decyl glucoside, coco glucoside, Herbal Conditioning agents (vegetable Glycerin), sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ]`;

const conditionerHowToUse = `[
      'How to Use',
      '1.\\tAfter shampooing, apply an adequate amount of IMERBELA Neem Seed Kernel Conditioner to wet hair.',
      '2.\\tGently massage into hair lengths and ends.',
      '3.\\tLeave on for 2–3 minutes.',
      '4.\\tRinse thoroughly with clean water.',
      '5.\\tFor best results, use regularly along with IMERBELA Neem Seed Kernel Shampoo.'
    ]`;

const conditionerIngredients = `[
      { name: 'Ingredients IMERBELA Neem Seed Kernel Conditioner :', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Aloe vera (Aloe barbadensis) Gel, Herbal Conditioning Agents (vegetable glycerine), herbal conditioning base, Natural Emollients, sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' }
    ]`;

const serumHowToUse = `[
      'Directions for Use /How to Use',
      'IMERBELA Neem Seed Kernel Hair Growth Serum',
      '1.\\tPrepare the Scalp',
      'For best results, apply on a clean scalp after washing. The Hair Growth serum can be used on a slightly damp scalp or on a dry scalp as well.',
      '2.\\tSection the Hair',
      'Divide hair into small, manageable sections so the dropper reaches the scalp directly, not just the hair strands.',
      '3.\\tApply the Hair Growth Serum',
      'Using the dropper, apply 2–3 drops directly onto the scalp in each section. Focus on areas of concern such as the hairline, crown, or thinning zones.',
      '4.\\tMassage Gently Hair Growth Serum',
      'Massage the Hair Growth serum into the scalp using fingertips in gentle circular motions for 2–3 minutes to help improve circulation and absorption.',
      '5.\\tLeave-In Treatment',
      'Do not rinse. Leave the Hair Growth Serum on to allow the active ingredients to work effectively.',
      '6.\\tUsage Frequency',
      'Use 3–4 drops (pea-sized amount) per application on average. Quantity may vary depending on scalp condition and hair density.'
    ]`;

const serumIngredients = `[
      { name: 'Ingredients IMERBELA Neem Seed Kernel Hair Growth Serum:', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Ginseng (Panax Ginseng) Root Extract, Burdock (Arctium Majus) Root Extract, Hydrolyzed Soy Protein, provitamin B5, Aloe vera (Aloe barbadensis) gel, plant keratin, plant-based Biotin, vegetable glycerin, sodium Benzoate and potassium sorbate (preservative), Permitted herbal Fragrance' }
    ]`;

const kitHowToUse = `[
      'Direction to use IMERBELA Neem Seed Kernel Shampoo',
      '1.\\tWet hair and scalp thoroughly with water.',
      '2.\\tTake an adequate amount of IMERBELA Neem Seed Kernel Shampoo in your palm.',
      '3.\\tApply evenly on scalp and hair.',
      '4.\\tGently massage with fingertips to form a rich lather.',
      '5.\\tLeave on for 1–2 minutes for better scalp cleansing.',
      '6.\\tRinse thoroughly with water.',
      '7.\\tRepeat if required.',
      '',
      'How to Use',
      '1.\\tAfter shampooing, apply an adequate amount of IMERBELA Neem Seed Kernel Conditioner to wet hair.',
      '2.\\tGently massage into hair lengths and ends.',
      '3.\\tLeave on for 2–3 minutes.',
      '4.\\tRinse thoroughly with clean water.',
      '5.\\tFor best results, use regularly along with IMERBELA Neem Seed Kernel Shampoo.',
      '',
      'Directions for Use /How to Use',
      'IMERBELA Neem Seed Kernel Hair Growth Serum',
      '1.\\tPrepare the Scalp',
      'For best results, apply on a clean scalp after washing. The Hair Growth serum can be used on a slightly damp scalp or on a dry scalp as well.',
      '2.\\tSection the Hair',
      'Divide hair into small, manageable sections so the dropper reaches the scalp directly, not just the hair strands.',
      '3.\\tApply the Hair Growth Serum',
      'Using the dropper, apply 2–3 drops directly onto the scalp in each section. Focus on areas of concern such as the hairline, crown, or thinning zones.',
      '4.\\tMassage Gently Hair Growth Serum',
      'Massage the Hair Growth serum into the scalp using fingertips in gentle circular motions for 2–3 minutes to help improve circulation and absorption.',
      '5.\\tLeave-In Treatment',
      'Do not rinse. Leave the Hair Growth Serum on to allow the active ingredients to work effectively.',
      '6.\\tUsage Frequency',
      'Use 3–4 drops (pea-sized amount) per application on average. Quantity may vary depending on scalp condition and hair density.'
    ]`;

const kitIngredients = `[
      { name: 'Ingredients  IMERBELA Neem Seed Kernel Shampoo :', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Bhringraj (Eclipta alba) whole plant extract, Shikakai (Acacia concinna) pod extract, Amla (Emblica officinalis) fruit extract, Aloe vera (Aloe barbadensis) Gel, Decyl glucoside, coco glucoside, Herbal Conditioning agents (vegetable Glycerin), sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' },
      { name: 'Ingredients IMERBELA Neem Seed Kernel Conditioner :', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Aloe vera (Aloe barbadensis) Gel, Herbal Conditioning Agents (vegetable glycerine), herbal conditioning base, Natural Emollients, sodium benzoate and potassium sorbate (preservative), Permitted herbal Fragrance.' },
      { name: 'Ingredients IMERBELA Neem Seed Kernel Hair Growth Serum:', benefit: 'Aqua, Neem seed kernel Extract (Azadirachta indica), Ginseng (Panax Ginseng) Root Extract, Burdock (Arctium Majus) Root Extract, Hydrolyzed Soy Protein, provitamin B5, Aloe vera (Aloe barbadensis) gel, plant keratin, plant-based Biotin, vegetable glycerin, sodium Benzoate and potassium sorbate (preservative), Permitted herbal Fragrance' }
    ]`;

for (const p of filePaths) {
  let content = fs.readFileSync(p, 'utf8');
  
  // replace blocks based on category clues
  // Match an object block { ... handle: ... }
  // We'll replace howToUse and ingredients based on the category inside the block
  
  content = content.replace(/\{([^{}]*?)handle:\s*['"]([^'"]+)['"]([\s\S]*?)\}/g, (match, prefix, handle, suffix) => {
    // Determine category
    let type = '';
    if (handle.includes('shampoo')) type = 'shampoo';
    else if (handle.includes('conditioner')) type = 'conditioner';
    else if (handle.includes('serum')) type = 'serum';
    else if (handle.includes('kit')) type = 'kit';
    
    if (!type) return match;
    
    let newSuffix = suffix;
    // Replace howToUse
    if (type === 'shampoo') {
      newSuffix = newSuffix.replace(/howToUse:\s*\[[\s\S]*?\],/, 'howToUse: ' + shampooHowToUse + ',');
      newSuffix = newSuffix.replace(/ingredients:\s*\[[\s\S]*?\],/, 'ingredients: ' + shampooIngredients + ',');
    } else if (type === 'conditioner') {
      newSuffix = newSuffix.replace(/howToUse:\s*\[[\s\S]*?\],/, 'howToUse: ' + conditionerHowToUse + ',');
      newSuffix = newSuffix.replace(/ingredients:\s*\[[\s\S]*?\],/, 'ingredients: ' + conditionerIngredients + ',');
    } else if (type === 'serum') {
      newSuffix = newSuffix.replace(/howToUse:\s*\[[\s\S]*?\],/, 'howToUse: ' + serumHowToUse + ',');
      newSuffix = newSuffix.replace(/ingredients:\s*\[[\s\S]*?\],/, 'ingredients: ' + serumIngredients + ',');
    } else if (type === 'kit') {
      newSuffix = newSuffix.replace(/howToUse:\s*\[[\s\S]*?\],/, 'howToUse: ' + kitHowToUse + ',');
      newSuffix = newSuffix.replace(/ingredients:\s*\[[\s\S]*?\],/, 'ingredients: ' + kitIngredients + ',');
    }
    
    return '{' + prefix + 'handle: \'' + handle + '\'' + newSuffix + '}';
  });

  fs.writeFileSync(p, content, 'utf8');
  console.log('Updated ' + p);
}
