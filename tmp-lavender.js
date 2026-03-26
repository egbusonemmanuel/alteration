const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        filelist = walkSync(filePath, filelist);
      }
    } else {
      if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.push('tailwind.config.js');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('gold') || content.includes('Gold')) {
    content = content.replace(/gold/g, 'lavender');
    content = content.replace(/Gold/g, 'Lavender');
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
  }
});
