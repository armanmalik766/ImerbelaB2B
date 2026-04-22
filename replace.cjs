const fs = require('fs');
const path = require('path');

const dirs = [
  'e:\\imerbela_minimilist\\pages',
  'e:\\imerbela_minimilist\\components',
  'e:\\imerbela_minimilist' // For App.tsx and types.ts
];

const processFile = (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/Wholesale/g, 'Seller').replace(/wholesale/g, 'seller');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
};

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules' && file !== '.git' && file !== 'backend') {
      // only walk components, pages, etc. we specified dirs explicitly
    } else {
      processFile(fullPath);
    }
  }
};

dirs.forEach(walk);
